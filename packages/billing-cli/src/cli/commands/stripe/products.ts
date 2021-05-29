// Libraries
import 'reflect-metadata';
import { Product, StripeBillingService } from '@atomly/billing-sdk';
import {
  ClassTransformValidator,
  Config,
} from '@atomly/config-loader';
import { IsString } from 'class-validator';
import Stripe from 'stripe';
import { CommandModule } from 'yargs';

// Relatives
import {
  ProductsCommandOptionsLoader,
  StripeLoader,
} from '../../config';
import { resolveAbsolutePath } from '../../utils/resolveAbsolutePath';

class ArgsValidator extends ClassTransformValidator {
  @IsString()
  productsCommandOptionsFileLocation: string;

  @IsString()
  stripeOptionsFileLocation: string;
}

export default {
  command: 'products',
  desc: 'Creates or updates products.',
  builder: {
    productsCommandOptionsFileLocation: {
      alias: 'o',
      describe: 'Products command options.',
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
      new ProductsCommandOptionsLoader({ fileLocationUri: `file://${resolveAbsolutePath(args.productsCommandOptionsFileLocation)}` }),
      new StripeLoader({ fileLocationUri: `file://${resolveAbsolutePath(args.stripeOptionsFileLocation)}` }),
    );
  
    await config.load();
  
    console.log('[DEBUG] Initiating process with config: ', JSON.stringify(config.stripe, null, 2));
  
    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    const billing = new StripeBillingService(stripe);
  
    for await (const p of config.productsCommandOptions.products) {
      let product: Product<Stripe.Metadata> | null = null;

      if (p.productId) {
        product = await billing.services.product.retrieve(p.productId);
      }

      // If the product exists, update. Otherwise, create new product.

      if (product) {
        console.debug(`[DEBUG] Updating product ${product.name}`);

        product = await billing.services.product.update(product.productId, p);

        // eslint-disable-next-line no-console
        console.log('[DEBUG] Updated product:\n', JSON.stringify(product, null, 2));

        return;
      }

      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] Creating product ${p.name}`, '\n');

      product = await billing.services.product.create(p);

      // eslint-disable-next-line no-console
      console.log('[DEBUG] Created product:\n', JSON.stringify(product, null, 2), '\n');
    }

    // eslint-disable-next-line no-console
    console.log('[DEBUG] Exiting...');
  },
} as CommandModule;
