// Libraries
import { Stripe } from 'stripe';
import faker from 'faker';

// Relatives
import { Customer, Subscription, StripeBilling, Product, Plan, RecurringInterval, Currency, PaymentMethod, CollectionMethod } from '../../../../../src';
import { config } from '../../../../config';

let billing: StripeBilling;
let customer: Customer;
let paymentMethod: PaymentMethod;
let product: Product<Stripe.Metadata>;
let plan: Plan<Stripe.Metadata>;
let subscription: Subscription;

describe('StripeBilling works correctly', () => {
  beforeAll(async () => {
    await config.load();

    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBilling(stripe);

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

    subscription = await billing.services.subscription.create({
      customerId: customer.customerId,
      paymentMethodId: paymentMethod.paymentMethodId,
      items: [{
        planId: plan.planId,
        quantity: 1,
      }],
      collectionMethod: CollectionMethod.CHARGE_AUTOMATICALLY,
    });
  });

  afterAll(async () => {
    await billing.services.customer.delete(customer.customerId);
    await billing.services.paymentMethod.delete(paymentMethod.paymentMethodId);
    await billing.services.product.delete(product.productId);
    await billing.services.plan.delete(plan.planId);
    await billing.services.subscription.delete(subscription.subscriptionId);
  });

  test('isCustomerSubscribedToPlan should return true when customer is subscribed to plan', async () => {
    const isSubscribed = await billing.capabilities.customer.isCustomerSubscribedToPlan(customer.customerId, plan.planId);

    expect(isSubscribed).toBe(true);
  });

  test('isCustomerSubscribedToPlan should return false when customer is NOT subscribed to plan', async () => {
    const isSubscribed = await billing.capabilities.customer.isCustomerSubscribedToPlan(customer.customerId, faker.random.uuid());

    expect(isSubscribed).toBe(false);
  });

  test('isCustomerSubscribedToPlan should throw error when customer does not exists', async () => {
    await expect(billing.capabilities.customer.isCustomerSubscribedToPlan(faker.random.uuid(), plan.planId)).rejects.toThrow();
  });
});
