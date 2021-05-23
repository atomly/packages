// Libraries
import 'reflect-metadata';
import {
  Config,
  IsString,
  IsBoolean,
  IsOptional,
} from '@atomly/config-loader';
import Stripe from 'stripe';
import {
  CommandBuilder,
} from 'yargs';

// Dependencies
import {
  MongoDBLoader,
  StripeLoader,
} from '../../config';
import {
  getDbContext,
  resolveConfigFileLocation,
} from '../../utils';
import { RecurringInterval, Currency } from '@atomly/surveyshark-collections-lib';

class Args {
  @IsString()
  dbConfigFileLocation: string;

  @IsString()
  stripeConfigFileLocation: string;

  @IsOptional()
  @IsBoolean()
  forceUpdatePlan?: boolean;
}

export const command = 'plans <db-config-file-location> <stripe-config-file-location>';
export const desc = 'Creates or updates (fixed) Subscription Plans with Stripe Products and Prices using local configurations';
export const builder: CommandBuilder = {
  forceUpdatePlan: {
    alias: 'f',
    describe: 'Flag necessary to forcely update Stripe prices.',
    demandOption: false,
    boolean: true,
  },
}
export async function handler(rawArgs: unknown): Promise<void> {
  const args = new Args();

  Object.assign(args, rawArgs);
  
  const config = new Config(
    new MongoDBLoader({ fileLocationUri: `file://${resolveConfigFileLocation(args.dbConfigFileLocation)}` }),
    new StripeLoader({ fileLocationUri: `file://${resolveConfigFileLocation(args.stripeConfigFileLocation)}` }),
  );

  try {
    await config.load();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.debug('DEBUG: ', JSON.stringify(e, null, 2));
    throw e;
  }

  // eslint-disable-next-line no-console
  console.log('[DEBUG] Initiating process with config: ', JSON.stringify(config.stripe, null, 2));

  const dbContext = getDbContext(config.db.dbConnectionString);

  await dbContext.open();

  const stripe = new Stripe(
    config.stripe.secretKey,
    { apiVersion: '2020-08-27' },
  );

  // For all plans found in the configuration:
  for (const plan of config.stripe.plans) {
    // 1. Check if plan exists.
    const planDocument = await dbContext.collections.Plans.model.findOne({ name: plan.name });

    // 2. If it exists, update plan in Stripe and in the local database.
    if (planDocument) {
      // eslint-disable-next-line no-console
      console.debug(`DEBUG: Updating Stripe plan ${plan.name}`);

      // First, check if the product and price exist in Stripe's API:
      if (!(stripe.products.retrieve(planDocument.product.externalId))) {
        throw new Error(`Product ${planDocument.product.externalId} not found in Stripe.`);
      }

      if (!(stripe.prices.retrieve(planDocument.price.externalId))) {
        throw new Error(`Price ${planDocument.price.externalId} not found in Stripe.`);
      }

      // Update the product, price, and SurveyShark plan if the data exists in Stripe:
      const product = await stripe.products.update(planDocument.product.externalId, {
        name: plan.product.name,
        description: plan.product.description,
        metadata: plan.metadata,
      });

      let price: Stripe.Price;

      const shouldUpdatePrice = (
        plan.price.currency !== planDocument.price.currency ||
        plan.price.unitAmount !== planDocument.price.unitAmount ||
        plan.price.recurring.interval !== planDocument.price.recurring.interval ||
        plan.price.recurring.intervalCount !== planDocument.price.recurring.intervalCount
      );

      if (
        !args.forceUpdatePlan &&
        shouldUpdatePrice
      ) {
        // eslint-disable-next-line no-console
        console.warn('WARN: Sorry, prices on Stripe are immutable. Most of its properties cannot be updated by design. However, the plan can be deleted in the dashboard and re-created programmatically. To do this, pass the --force-price-update flag.');

        price = await stripe.prices.retrieve(planDocument.price.externalId);
      } else if (
        args.forceUpdatePlan &&
        shouldUpdatePrice
      ) {
        // eslint-disable-next-line no-console
        console.warn(`WARN: Detected --force-price-update flag. I sure hope you know what you're doing. Remember to delete the previous plan through the dashboard using ID: ${planDocument.price.externalId}.`);

        price = await stripe.prices.create({
          product: product.id,
          nickname: plan.price.nickname,
          currency: plan.price.currency,
          unit_amount: plan.price.unitAmount,
          recurring: {
            interval: plan.price.recurring.interval,
            interval_count: plan.price.recurring.intervalCount,
          },
          metadata: plan.metadata,
        });
      } else {
        price = await stripe.prices.retrieve(planDocument.price.externalId);
      }

      const updatedPlanDocument = await dbContext.collections.Plans
        .model
        .findOneAndUpdate(
          { uuid: planDocument.uuid },
          {
            name: plan.name,
            description: plan.description,
            isActive: plan.isActive,
            product: {
              externalId: product.id,
              name: product.name,
              description: product.description ?? undefined,
              metadata: product.metadata,
            },
            price: {
              externalId: price.id,
              nickname: price.nickname!,
              currency: price.currency as Currency,
              unitAmount: price.unit_amount!,
              recurring: {
                interval: price.recurring!.interval as RecurringInterval,
                intervalCount: price.recurring!.interval_count,
              },
              metadata: price.metadata,
            },
            metadata: plan.metadata,
          },
          { new: true },
        )
        .lean();

      // eslint-disable-next-line no-console
      console.log('[DEBUG] Updated plan:\n', JSON.stringify(updatedPlanDocument, null, 2));

    // 3. Otherwise, create plan in Stripe and in the local database.
    } else {
      // eslint-disable-next-line no-console
      console.debug(`DEBUG: Creating Stripe plan ${plan.name}`, '\n');

      const product = await stripe.products.create({
        name: plan.product.name,
        description: plan.product.description,
        metadata: plan.metadata,
      });

      const price = await stripe.prices.create({
        product: product.id,
        nickname: plan.price.nickname,
        currency: plan.price.currency,
        unit_amount: plan.price.unitAmount,
        recurring: {
          interval: plan.price.recurring.interval,
          interval_count: plan.price.recurring.intervalCount,
        },
        metadata: plan.metadata,
      });

      const planDocument = await new dbContext.collections.Plans
        .model({
          name: plan.name,
          description: plan.description,
          isActive: plan.isActive,
          product: {
            externalId: product.id,
            name: product.name,
            description: product.description,
            metadata: product.metadata,
          },
          price: {
            externalId: price.id,
            nickname: price.nickname,
            currency: price.currency,
            unitAmount: price.unit_amount,
            recurring: {
              interval: price.recurring!.interval,
              intervalCount: price.recurring!.interval_count,
            },
            metadata: price.metadata,
          },
          metadata: plan.metadata,
        })
        .save();

      // eslint-disable-next-line no-console
      console.log('[DEBUG] Created plan:\n', JSON.stringify(planDocument, null, 2), '\n');
    }
  }

  await dbContext.close();

  // eslint-disable-next-line no-console
  console.log('[DEBUG] Exiting...');
}
