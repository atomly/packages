// Libraries
import { Stripe } from 'stripe';
import faker from 'faker';

// Relatives
import { Product, StripeBillingService } from '../../src';
import { config } from '../config';

let billing: StripeBillingService;
let product: Product<Stripe.Metadata>;

describe('StripeBillingService works correctly', () => {
  beforeAll(async () => {
    await config.load();

    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBillingService(stripe);
  });

  //
  // CREATE
  //

  test('should create product', async () => {
    const params = {
      name: faker.commerce.product(),
      active: faker.random.boolean(),
      description: faker.commerce.productDescription(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    };

    product = await billing.services.product.create(params);

    expect(product.productId).toBeTruthy();
    expect(product.description).toBe(params.description);
    expect(product.active).toBe(params.active);
    expect(product.description).toBe(params.description);
    expect(product.metadata).toMatchObject(params.metadata);
  });

  test('should throw error when creating product with invalid params', async () => {
    const params = {
      name: '',
      active: faker.random.boolean(),
      description: faker.commerce.productDescription(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    };

    await expect(billing.services.product.create(params)).rejects.toThrow();
  });

  //
  // RETRIEVE
  //

  test('should retrieve product', async () => {
    const res = await billing.services.product.retrieve(product.productId);

    expect(product).toMatchObject(res!)
  });

  test('should throw error when retrieving invalid product', async () => {
    await expect(billing.services.product.retrieve(faker.random.uuid())).rejects.toThrow();
  });

  //
  // UPDATE
  //

  test('should update product', async () => {
    const params = {
      name: faker.commerce.product(),
      active: !product.active,
      description: faker.commerce.productDescription(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    };

    product = await billing.services.product.update(product.productId, params);

    expect(product.productId).toBeTruthy();
    expect(product.description).toBe(params.description);
    expect(product.active).toBe(params.active);
    expect(product.description).toBe(params.description);
    expect(product.metadata).toMatchObject(params.metadata);
  });

  test('should throw error when updating product with invalid params', async () => {
    const params = {
      name: '',
    };

    await expect(billing.services.product.update(product.productId, params)).rejects.toThrow();
  });

  //
  // LIST
  //

  test('should list products', async () => {
    const res = await billing.services.product.list({});

    expect(res.data.length).toBeGreaterThanOrEqual(1);
  });

  //
  // DELETE
  //

  test('should delete product', async () => {
    const res = await billing.services.product.delete(product.productId);

    expect(res).toBe(true);
  });

  test('should throw error when deleting product that does not exists', async () => {
    await expect(billing.services.product.delete(faker.random.uuid())).rejects.toThrow();
  });
});
