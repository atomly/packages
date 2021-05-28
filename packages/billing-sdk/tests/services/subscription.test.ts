// Libraries
import { Stripe } from 'stripe';
import faker from 'faker';

// Relatives
import { Customer, Subscription, StripeBillingService, Product, Plan, RecurringInterval, Currency, PaymentMethod, CollectionMethod } from '../../src';
import { config } from '../config';

let billing: StripeBillingService;
let customer: Customer;
let paymentMethod: PaymentMethod;
let product: Product<Stripe.Metadata>;
let plan: Plan<Stripe.Metadata>;
let subscription: Subscription;

describe('StripeBillingService works correctly', () => {
  beforeAll(async () => {
    await config.load();

    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBillingService(stripe);

    customer = await billing.services.customer.create({
      description: faker.random.words(),
      email: faker.internet.email(),
    });

    paymentMethod = await billing.services.paymentMethod.create({
      customerId: customer.customerId,
      card: {
        cvc: faker.finance.creditCardCVV(),
        expMonth: Math.floor(Number(faker.finance.amount(1, 12))),
        expYear: Math.floor(Number(faker.finance.amount(new Date().getFullYear(), new Date().getFullYear() + 10))),
        number: '4242-4242-4242-4242',
      },
      details: {
        address: {
          city: faker.address.city(),
          country: faker.address.countryCode(),
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          postalCode: faker.address.zipCode(),
          state: faker.address.state(),
        },
        email: faker.internet.email(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        phone: faker.phone.phoneNumber(),
      },
    });

    product = await billing.services.product.create({
      name: faker.commerce.product(),
      active: true,
      description: faker.commerce.productDescription(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    });

    plan = await billing.services.plan.create({
      recurring: {
        interval: RecurringInterval.MONTH,
        intervalCount: faker.random.number(11) + 1,
      },
      productId: product.productId,
      active: true,
      nickname: faker.commerce.product(),
      currency: Currency.USD,
      unitAmount: Number(faker.commerce.price()),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.internet.email(),
      },
    });
  });

  afterAll(async () => {
    await billing.services.customer.delete(customer.customerId);
    await billing.services.paymentMethod.delete(paymentMethod.paymentMethodId);
    await billing.services.product.delete(product.productId);
    await billing.services.plan.delete(plan.planId);
  });

  //
  // CREATE
  //

  test('should create subscription', async () => {
    const params = {
      customerId: customer.customerId,
      paymentMethodId: paymentMethod.paymentMethodId,
      items: [{
        planId: plan.planId,
        quantity: 1,
      }],
      collectionMethod: CollectionMethod.CHARGE_AUTOMATICALLY,
    };

    subscription = await billing.services.subscription.create(params);

    expect(subscription.subscriptionId).toBeTruthy();
    expect(subscription.customerId).toBe(customer.customerId);
    expect(subscription.paymentMethodId).toBe(paymentMethod.paymentMethodId);
    expect(subscription.items).toMatchObject(params.items);
    expect(subscription.status).toBeTruthy();
    expect(subscription.collectionMethod).toBe(params.collectionMethod);
    expect(subscription.daysUntilDue).toBeFalsy();
    expect(subscription.latestInvoiceId).toBeTruthy();
  });

  test('should throw error when creating subscription with invalid params', async () => {
    const params = {
      customerId: faker.random.uuid(),
      paymentMethodId: paymentMethod.paymentMethodId,
      items: [{
        planId: plan.planId,
        quantity: 1,
      }],
      collectionMethod: CollectionMethod.CHARGE_AUTOMATICALLY,
    };

    await expect(billing.services.subscription.create(params)).rejects.toThrow();
  });

  //
  // RETRIEVE
  //

  test('should retrieve subscription', async () => {
    const res = await billing.services.subscription.retrieve(subscription.subscriptionId);

    expect(subscription).toMatchObject(res!)
  });

  test('should throw error when retrieving invalid subscription', async () => {
    await expect(billing.services.subscription.retrieve(faker.random.uuid())).rejects.toThrow();
  });

  //
  // UPDATE
  //

  test('should update subscription', async () => {
    const params = {
      paymentMethodId: paymentMethod.paymentMethodId,
      items: [{
        subscriptionItemId: subscription.items[0].subscriptionItemId,
        planId: subscription.items[0].planId,
        quantity: 5,
      }],
      collectionMethod: CollectionMethod.SEND_INVOICE,
      daysUntilDue: 30,
    };

    subscription = await billing.services.subscription.update(subscription.subscriptionId, params);

    expect(subscription.paymentMethodId).toBe(paymentMethod.paymentMethodId);
    expect(subscription.items).toMatchObject(params.items);
    expect(subscription.collectionMethod).toBe(params.collectionMethod);
    expect(subscription.daysUntilDue).toBe(params.daysUntilDue);
  });

  test('should throw error when updating subscription with invalid params', async () => {
    const params = {
      paymentMethodId: faker.random.uuid(),
      items: [{
        subscriptionItemId: subscription.items[0].subscriptionItemId,
        planId: subscription.items[0].planId,
        quantity: Math.floor(faker.random.number()) + 1,
      }],
      collectionMethod: CollectionMethod.SEND_INVOICE,
    };

    await expect(billing.services.subscription.update(subscription.subscriptionId, params)).rejects.toThrow();
  });

  //
  // LIST
  //

  test('should list subscriptions', async () => {
    const res = await billing.services.subscription.list({ planId: plan.planId });

    expect(res.data.length).toBeGreaterThanOrEqual(1);
  });

  //
  // DELETE
  //

  test('should delete subscription', async () => {
    const res = await billing.services.subscription.delete(subscription.subscriptionId);

    expect(res).toBe(true);
  });

  test('should throw error when deleting subscription that does not exists', async () => {
    await expect(billing.services.subscription.delete(faker.random.uuid())).rejects.toThrow();
  });
});
