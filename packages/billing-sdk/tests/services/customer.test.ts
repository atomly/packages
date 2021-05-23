// Libraries
import { Stripe } from 'stripe';
import faker from 'faker';

// Relatives
import { Customer, StripeBillingService } from '../../src';
import { config } from '../config';

let billing: StripeBillingService;
let customer: Customer;

describe('StripeBillingService works correctly', () => {
  beforeAll(async () => {
    await config.load();

    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBillingService(stripe);
  });

  test('should create customer', async () => {
    const params = {
      description: faker.random.words(),
      email: faker.internet.email(),
    };

    customer = await billing.services.customer.create(params);

    expect(customer.description).toBe(params.description);
    expect(customer.email).toBe(params.email);
    expect(customer.customerId).toBeTruthy();
    expect(customer.invoicePrefix).toBeTruthy();
    expect(customer.defaultPaymentMethodId).toBeFalsy();
  });

  test('should retrieve customer', async () => {
    const res = await billing.services.customer.retrieve(customer.customerId);

    expect(customer).toMatchObject(res!)
  });

  test('should throw error when retrieving invalid customer', async () => {
    expect(billing.services.customer.retrieve(faker.random.uuid())).rejects.toThrow();
  });

  test('should delete customer', async () => {
    const res = await billing.services.customer.delete(customer.customerId);

    expect(res).toBe(true);
  });
});
