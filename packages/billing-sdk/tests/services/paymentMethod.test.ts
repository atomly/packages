// Libraries
import { Stripe } from 'stripe';
import faker from 'faker';

// Relatives
import { Customer, PaymentMethod, StripeBillingService } from '../../src';
import { config } from '../config';

let billing: StripeBillingService;
let customer: Customer;
let paymentMethod: PaymentMethod;

describe('StripeBillingService works correctly', () => {
  beforeAll(async () => {
    await config.load();

    const stripe = new Stripe(
      config.stripe.secretKey,
      { apiVersion: '2020-08-27' },
    );

    billing = new StripeBillingService(stripe);

    const params = {
      description: faker.random.words(),
      email: faker.internet.email(),
    };

    customer = await billing.services.customer.create(params);
  });

  afterAll(async () => {
    await billing.services.customer.delete(customer.customerId);
  });

  //
  // CREATE
  //

  test('should create paymentMethod', async () => {
    const params = {
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
    };

    paymentMethod = await billing.services.paymentMethod.create(params);

    expect(paymentMethod.paymentMethodId).toBeTruthy();
    expect(paymentMethod.customerId).toBe(customer.customerId);
    expect(paymentMethod.card).toMatchObject({
      brand: 'visa',
      expMonth: params.card.expMonth,
      expYear: params.card.expYear,
      lastFourDigits: '4242',
    });
    expect(paymentMethod.card.fingerprint).toBeTruthy();
    expect(paymentMethod.details).toMatchObject(params.details);
  });

  test('should throw error when creating paymentMethod with invalid params', async () => {
    const params = {
      customerId: faker.random.uuid(),
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
    };

    await expect(billing.services.paymentMethod.create(params)).rejects.toThrow();
  });

  //
  // RETRIEVE
  //

  test('should retrieve paymentMethod', async () => {
    const res = await billing.services.paymentMethod.retrieve(paymentMethod.paymentMethodId);

    expect(paymentMethod).toMatchObject(res!)
  });

  test('should throw error when retrieving invalid paymentMethod', async () => {
    await expect(billing.services.paymentMethod.retrieve(faker.random.uuid())).rejects.toThrow();
  });

  //
  // UPDATE
  //

  test('should update paymentMethod', async () => {
    const params = {
      customerId: faker.random.uuid(),
      card: {
        expMonth: Math.floor(Number(faker.finance.amount(1, 12))),
        expYear: Math.floor(Number(faker.finance.amount(new Date().getFullYear(), new Date().getFullYear() + 10))),
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
    };

    paymentMethod = await billing.services.paymentMethod.update(paymentMethod.paymentMethodId, params);

    expect(paymentMethod.paymentMethodId).toBeTruthy();
    expect(paymentMethod.customerId).toBe(customer.customerId);
    expect(paymentMethod.card).toMatchObject({
      brand: 'visa',
      expMonth: params.card.expMonth,
      expYear: params.card.expYear,
      fingerprint: paymentMethod.card.fingerprint,
      lastFourDigits: paymentMethod.card.lastFourDigits,
    });
    expect(paymentMethod.card.fingerprint).toBeTruthy();
    expect(paymentMethod.details).toMatchObject(params.details);
  });

  test('should throw error when updating paymentMethod with invalid params', async () => {
    const params = {
      card: {
        expMonth: Math.floor(Number(faker.finance.amount(1, 12))),
        expYear: Math.floor(Number(faker.finance.amount(new Date().getFullYear(), new Date().getFullYear() + 10))),
      },
      details: {
        address: {
          city: faker.address.city(),
          country: faker.address.country(), // Invalid
          line1: faker.address.streetAddress(),
          line2: faker.address.secondaryAddress(),
          postalCode: faker.address.zipCode(),
          state: faker.address.state(),
        },
        email: faker.internet.email(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        phone: faker.phone.phoneNumber(),
      },
    };

    await expect(billing.services.paymentMethod.update(paymentMethod.paymentMethodId, params)).rejects.toThrow();
  });

  //
  // LIST
  //

  test('should list paymentMethods', async () => {
    const res = await billing.services.paymentMethod.list({ customerId: customer.customerId });

    expect(res.data.length).toBeGreaterThanOrEqual(1);
  });

  //
  // DELETE
  //

  test('should delete paymentMethod', async () => {
    const res = await billing.services.paymentMethod.delete(paymentMethod.paymentMethodId);

    expect(res).toBe(true);
  });

  test('should throw error when deleting paymentMethod that does not exists', async () => {
    await expect(billing.services.paymentMethod.delete(faker.random.uuid())).rejects.toThrow();
  });
});
