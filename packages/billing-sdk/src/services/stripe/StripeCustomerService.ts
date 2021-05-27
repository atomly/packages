// Libraries
import { Stripe } from 'stripe';
import { omitBy, isNil } from 'lodash';

// Relatives
import { CrudServiceListResponse, Customer, CustomerService, CustomerServiceCreateParams, CustomerServiceListParams, CustomerServiceUpdateParams } from '../../lib';

export class StripeCustomerService implements CustomerService {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  public async create(params: CustomerServiceCreateParams): Promise<Customer> {
    const res = await this.stripe.customers.create(params);

    return {
      customerId: res.id,
      description: res.description!,
      email: res.email!,
      defaultPaymentMethodId: res.default_source as string,
      invoicePrefix: res.invoice_prefix!,
    };
  }

  public async retrieve(customerId: string): Promise<Customer | null> {
    const res = await this.stripe.customers.retrieve(customerId);

    if (StripeCustomerService.isDeleted(res)) {
      return null;
    }

    return {
      customerId: res.id,
      description: res.description!,
      email: res.email!,
      defaultPaymentMethodId: res.default_source as string,
      invoicePrefix: res.invoice_prefix!,
    };
  }

  public async update(customerId: string, params: CustomerServiceUpdateParams): Promise<Customer> {
    // Omits empty properties.
    const stripeParams: Stripe.CustomerUpdateParams = omitBy(
      {
        description: params.description,
        email: params.email,
        default_source: params.defaultPaymentMethodId,
        invoice_prefix: params.invoicePrefix,
      } as Stripe.CustomerUpdateParams,
      isNil,
    );

    const res = await this.stripe.customers.update(customerId, stripeParams);

    return {
      customerId: res.id,
      description: res.description!,
      email: res.email!,
      defaultPaymentMethodId: res.default_source as string,
      invoicePrefix: res.invoice_prefix!,
    };
  }

  public async delete(customerId: string): Promise<boolean> {
    const res = await this.stripe.customers.del(customerId);

    return res.deleted;
  }

  public async list(params: CustomerServiceListParams): Promise<CrudServiceListResponse<Customer>> {
    const res = await this.stripe.customers.list({
      created: params.created,
      ending_before: params.endingBefore,
      limit: params.limit,
      starting_after: params.startingAfter,
    });

    return {
      hasMore: res.has_more,
      data: res.data.map(customer => ({
        customerId: customer.id,
        description: customer.description!,
        email: customer.email!,
        defaultPaymentMethodId: customer.default_source as string,
        invoicePrefix: customer.invoice_prefix!,
      })),
    };
  }

  static isDeleted(customer: Stripe.Customer | Stripe.DeletedCustomer): customer is Stripe.DeletedCustomer {
    return Boolean(customer.deleted);
  }
}
