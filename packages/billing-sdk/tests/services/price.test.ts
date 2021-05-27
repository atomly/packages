// Libraries
import { Stripe } from 'stripe';
import faker from 'faker';

// Relatives
import { Product, Price, StripeBillingService, Currency } from '../../src';
import { config } from '../config';

let billing: StripeBillingService;
let product: Product<Stripe.Metadata>;
let price: Price<Stripe.Metadata>;

describe('StripeBillingService works correctly', () => {
  beforeAll(async () => {
    await config.load();

    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBillingService(stripe);

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

  test('should create price', async () => {
    const params = {
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

    price = await billing.services.price.create(params);

    expect(price.priceId).toBeTruthy();
    expect(price.productId).toBe(params.productId);
    expect(price.active).toBe(params.active);
    expect(price.nickname).toBe(params.nickname);
    expect(price.currency).toBe(params.currency);
    expect(price.unitAmount).toBe(params.unitAmount);
    expect(price.metadata).toMatchObject(params.metadata);
  });

  test('should throw error when creating price with invalid params', async () => {
    const params = {
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

    await expect(billing.services.price.create(params)).rejects.toThrow();
  });

  //
  // RETRIEVE
  //

  test('should retrieve price', async () => {
    const res = await billing.services.price.retrieve(price.priceId);

    expect(price).toMatchObject(res!)
  });

  test('should throw error when retrieving invalid price', async () => {
    await expect(billing.services.price.retrieve(faker.random.uuid())).rejects.toThrow();
  });

  //
  // UPDATE
  //

  test('should update price', async () => {
    const params = {
      nickname: faker.commerce.product(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    };

    price = await billing.services.price.update(price.priceId, params);

    expect(price.priceId).toBeTruthy();
    expect(price.nickname).toBe(params.nickname);
    expect(price.metadata).toMatchObject(params.metadata);
  });

  test('should throw error when updating price with invalid params', async () => {
    const params = {
      nickname: faker.commerce.product(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    };

    await expect(billing.services.price.update(faker.random.uuid(), params)).rejects.toThrow();
  });

  //
  // LIST
  //

  test('should list prices', async () => {
    const res = await billing.services.price.list({ productId: product.productId });

    expect(res.data.length).toBeGreaterThanOrEqual(1);
  });

  //
  // DELETE
  //

  test('should delete price', async () => {
    const res = await billing.services.price.delete(price.priceId);

    expect(res).toBe(true);
  });

  test('should throw error when deleting price that does not exists', async () => {
    await expect(billing.services.price.delete(faker.random.uuid())).rejects.toThrow();
  });
});
