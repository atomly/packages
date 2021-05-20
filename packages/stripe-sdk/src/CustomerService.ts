// Libraries
import { Stripe } from 'stripe';
import { omitBy, isEmpty } from 'lodash-es';

// Relatives
import { Customer } from './lib/interfaces';

class CustomerService implements Omit<CrudService, 'readList'> {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  /**
   * Create a customer.
   */
  public async create(params: Omit<Customer, 'customerId'>): Promise<Customer> {
    const res = await this.stripe.customers.create(params);

    return {
      customerId: res.id,
      description: res.description,
      email: res.email,
      defaultPaymentMethodId: res.default_source as string,
      invoicePrefix: res.invoice_prefix,
    };
  }

  /**
   * Retrieves the details of an existing customer. You need only supply the unique customer identifier that was returned upon customer creation.
   */
  public async read(id: string): Promise<Customer | null> {
    const res = await this.stripe.customers.retrieve(id);

    if (CustomerService.isDeleted(res)) {
      return null;
    }

    return {
      customerId: res.id,
      description: res.description,
      email: res.email,
      defaultPaymentMethodId: res.default_source as string,
      invoicePrefix: res.invoice_prefix,
    };
  }

  /**
   * Updates the specified customer by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
   */
  public async update(id: string, customer: Partial<Omit<Customer, 'customerId'>>): Promise<Customer> {
    // Omits empty properties.
    const params: Stripe.CustomerUpdateParams = omitBy(
      {
        description: customer.description,
        email: customer.email,
        default_source: customer.defaultPaymentMethodId,
        invoice_prefix: customer.invoicePrefix,
      },
      isEmpty,
    );

    const res = await this.stripe.customers.update(id, params);

    return {
      customerId: res.id,
      description: res.description,
      email: res.email,
      defaultPaymentMethodId: res.default_source as string,
      invoicePrefix: res.invoice_prefix,
    };
  }

  /**
   * Returns an object with a deleted parameter on success. If the customer ID does not exist, this call returns an error.
   */
  public async delete(id: string): Promise<boolean> {
    const res = await this.stripe.customers.del(id);

    return res.deleted;
  }

  /**
   * Determines whether a customer is a deleted customer.
   */
  static isDeleted(customer: Stripe.Customer | Stripe.DeletedCustomer): customer is Stripe.DeletedCustomer {
    return Boolean(customer.deleted);
  }
}
