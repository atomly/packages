// Libraries
import { Stripe } from 'stripe';
import faker from 'faker';

// Relatives
import { Product, Plan, StripeBilling, RecurringInterval, Currency } from '../../../../../src';
import { config } from '../../../../config';

let billing: StripeBilling;
let product: Product<Stripe.Metadata>;
let plan: Plan<Stripe.Metadata>;

describe('StripeBilling works correctly', () => {
  beforeAll(async () => {
    await config.load();

    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBilling(stripe);

    product = await billing.services.product.create({
      name: faker.commerce.product(),
      active: true,
      description: faker.commerce.productDescription(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    });
  });

  afterAll(async () => {
    await billing.services.product.delete(product.productId);
  });

  //
  // CREATE
  //

  test('should create plan', async () => {
    const params = {
      recurring: {
        interval: RecurringInterval.MONTH,
        intervalCount: faker.random.number(11) + 1,
      },
      productId: product.productId,
      active: faker.random.boolean(),
      nickname: faker.commerce.product(),
      currency: Currency.USD,
      unitAmount: Number(faker.commerce.price()),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    };

    plan = await billing.services.plan.create(params);

    expect(plan.planId).toBeTruthy();
    expect(plan.recurring).toMatchObject(params.recurring);
    expect(plan.productId).toBe(params.productId);
    expect(plan.active).toBe(params.active);
    expect(plan.nickname).toBe(params.nickname);
    expect(plan.currency).toBe(params.currency);
    expect(plan.unitAmount).toBe(params.unitAmount);
    expect(plan.metadata).toMatchObject(params.metadata);
  });

  test('should throw error when creating plan with invalid params', async () => {
    const params = {
      recurring: {
        interval: RecurringInterval.MONTH,
        intervalCount: faker.random.number(11) + 1,
      },
      productId: faker.random.uuid(), // Invalid
      active: faker.random.boolean(),
      nickname: faker.commerce.product(),
      currency: Currency.USD,
      unitAmount: Number(faker.commerce.price()),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    };

    await expect(billing.services.plan.create(params)).rejects.toThrow();
  });

  //
  // RETRIEVE
  //

  test('should retrieve plan', async () => {
    const res = await billing.services.plan.retrieve(plan.planId);

    expect(plan).toMatchObject(res!)
  });

  test('should throw error when retrieving invalid plan', async () => {
    await expect(billing.services.plan.retrieve(faker.random.uuid())).rejects.toThrow();
  });

  //
  // UPDATE
  //

  test('should update plan', async () => {
    const params = {
      nickname: faker.commerce.product(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    };

    plan = await billing.services.plan.update(plan.planId, params);

    expect(plan.planId).toBeTruthy();
    expect(plan.nickname).toBe(params.nickname);
    expect(plan.metadata).toMatchObject(params.metadata);
  });

  test('should throw error when updating plan with invalid params', async () => {
    const params = {
      nickname: faker.commerce.product(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    };

    await expect(billing.services.plan.update(faker.random.uuid(), params)).rejects.toThrow();
  });

  //
  // LIST
  //

  test('should list plans', async () => {
    const res = await billing.services.plan.list({ productId: product.productId });

    expect(res.data.length).toBeGreaterThanOrEqual(1);
  });

  //
  // DELETE
  //

  test('should delete plan', async () => {
    const res = await billing.services.plan.delete(plan.planId);

    expect(res).toBe(true);
  });

  test('should throw error when deleting plan that does not exists', async () => {
    await expect(billing.services.plan.delete(faker.random.uuid())).rejects.toThrow();
  });
});
