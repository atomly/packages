// Libraries
import { Stripe } from 'stripe';

// Relatives
import { StripeBilling } from '../../../../src';
import { config } from '../../../config';

let billing: StripeBilling;

describe('StripeBilling works correctly', () => {
  beforeAll(async () => {
    await config.load();
  });

  test('should instantiate StripeBilling correctly', async () => {
    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBilling(stripe);

    expect(billing.services).toBeTruthy();
  });
});
