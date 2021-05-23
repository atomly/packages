// Libraries
import { Stripe } from 'stripe';

// Relatives
import { StripeBillingService } from '../../src';
import { config } from '../config';

let billing: StripeBillingService;

describe('StripeBillingService works correctly', () => {
  beforeAll(async () => {
    await config.load();
  });

  test('should instantiate StripeBillingService correctly', async () => {
    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBillingService(stripe);

    expect(billing.services).toBeTruthy();
  });
});
