// Libraries
import { Stripe } from 'stripe';
import faker from 'faker';

// Relatives
import { Customer, StripeBilling } from '../../../../../src';
import { config } from '../../../../config';

let billing: StripeBilling;
let customer: Customer;

describe('StripeBilling works correctly', () => {
  beforeAll(async () => {
    await config.load();

    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBilling(stripe);
  });

  //
  // CREATE
  //

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

  test('should throw error when creating customer with invalid params', async () => {
    const params = {
      description: faker.random.words(),
      email: faker.random.word(),
    };

    await expect(billing.services.customer.create(params)).rejects.toThrow();
  });

  //
  // RETRIEVE
  //

  test('should retrieve customer', async () => {
    const res = await billing.services.customer.retrieve(customer.customerId);

    expect(customer).toMatchObject(res!)
  });

  test('should throw error when retrieving invalid customer', async () => {
    await expect(billing.services.customer.retrieve(faker.random.uuid())).rejects.toThrow();
  });

  //
  // UPDATE
  //

  test('should update customer', async () => {
    const params = {
      description: faker.random.words(),
      email: faker.internet.email(),
    };

    customer = await billing.services.customer.update(customer.customerId, params);

    expect(customer.description).toBe(params.description);
    expect(customer.email).toBe(params.email);
    expect(customer.customerId).toBeTruthy();
    expect(customer.invoicePrefix).toBeTruthy();
    expect(customer.defaultPaymentMethodId).toBeFalsy();
  });

  test('should throw error when updating customer with invalid params', async () => {
    const params = {
      description: faker.random.words(),
      email: faker.random.word(),
    };

    await expect(billing.services.customer.update(customer.customerId, params)).rejects.toThrow();
  });

  //
  // LIST
  //

  test('should list customers', async () => {
    const res = await billing.services.customer.list({});

    expect(res.data.length).toBeGreaterThanOrEqual(1);
  });

  //
  // DELETE
  //

  test('should delete customer', async () => {
    const res = await billing.services.customer.delete(customer.customerId);

    expect(res).toBe(true);
  });

  test('should throw error when deleting customer that does not exists', async () => {
    await expect(billing.services.customer.delete(faker.random.uuid())).rejects.toThrow();
  });
});
