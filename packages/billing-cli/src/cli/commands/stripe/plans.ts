// Libraries
import 'reflect-metadata';
import { Plan, StripeBillingService } from '@atomly/billing-sdk';
import {
  ClassTransformValidator,
  Config,
} from '@atomly/config-loader';
import { IsString } from 'class-validator';
import Stripe from 'stripe';
import { CommandModule } from 'yargs';

// Relatives
import {
  PlansCommandOptionsLoader,
  StripeLoader,
} from '../../config';
import { resolveAbsolutePath } from '../../utils/resolveAbsolutePath';

class ArgsValidator extends ClassTransformValidator {
  @IsString()
  plansCommandOptionsFileLocation: string;

  @IsString()
  stripeOptionsFileLocation: string;
}

export default {
  command: 'plans',
  desc: 'Creates or updates plans.',
  builder: {
    plansCommandOptionsFileLocation: {
      alias: 'o',
      describe: 'Plans command options.',
    },
    stripeOptionsFileLocation: {
      alias: 'b',
      describe: 'Billing SDK that will interface with the client API, e.g. Stripe Billing SDK.',
    },
  },
  handler: async (rawArgs: unknown): Promise<void> => {
    const args = new ArgsValidator();
  
    Object.assign(args, rawArgs);

    args.__transformAndValidateOrRejectSync(args);

    const config = new Config(
      new PlansCommandOptionsLoader({ fileLocationUri: `file://${resolveAbsolutePath(args.plansCommandOptionsFileLocation)}` }),
      new StripeLoader({ fileLocationUri: `file://${resolveAbsolutePath(args.stripeOptionsFileLocation)}` }),
    );
  
    await config.load();
  
    console.log('[DEBUG] Initiating process with config: ', JSON.stringify(config.stripe, null, 2));
  
    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    const billing = new StripeBillingService(stripe);
  
    for await (const p of config.plansCommandOptions.plans) {
      const product = await billing.services.product.retrieve(p.productId);

      if (!product) {
        throw new Error(`Product ${p.productId} not found.`);
      }

      let plan: Plan<Stripe.Metadata> | null = null;

      if (p.planId) {
        plan = await billing.services.plan.retrieve(p.planId);
      }

      // If the plan exists, update. Otherwise, create new plan.

      if (plan) {
        console.debug(`[DEBUG] Updating plan ${plan.nickname}`);

        const shouldUpdatePlan = (
          plan.currency !== p.currency ||
          plan.unitAmount !== p.unitAmount ||
          plan.recurring.interval !== p.recurring.interval ||
          plan.recurring.intervalCount !== p.recurring.intervalCount
        );

        if (
          !config.plansCommandOptions.forceUpdatePlan &&
          shouldUpdatePlan
        ) {
          console.warn('[WARN] Sorry, prices on are immutable. Most of its properties cannot be updated by design. However, the plan can be deleted then re-created programmatically. To do this, pass the forcePlanUpdate flag as true in the options.');
        } else if (
          config.plansCommandOptions.forceUpdatePlan &&
          shouldUpdatePlan
        ) {
          console.warn(`[WARN] Detected forcePlanUpdate flag. I sure hope you know what you're doing. Remember to delete the previous plan through the dashboard using ID: ${plan.planId}.`);

          await billing.services.plan.delete(plan.planId);

          plan = await billing.services.plan.create(p);
        } else {
          plan = await billing.services.plan.update(plan.planId, p);
        }

        // eslint-disable-next-line no-console
        console.log('[DEBUG] Updated plan:\n', JSON.stringify(plan, null, 2));

        return;
      }

      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] Creating plan ${p.nickname}`, '\n');

      plan = await billing.services.plan.create(p);

      // eslint-disable-next-line no-console
      console.log('[DEBUG] Created plan:\n', JSON.stringify(plan, null, 2), '\n');
    }

    // eslint-disable-next-line no-console
    console.log('[DEBUG] Exiting...');
  },
} as CommandModule;
