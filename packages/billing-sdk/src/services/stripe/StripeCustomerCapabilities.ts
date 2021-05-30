// Libraries
import { Stripe } from 'stripe';

// Relatives
import { CustomerCapabilities } from '../../lib';

export class StripeCustomerCapabilities implements CustomerCapabilities {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  public async isCustomerSubscribedToPlan(customerId: string, planId: string): Promise<boolean> {
    const res = await this.stripe.customers.retrieve(customerId, { expand: ['subscriptions'] });

    if (StripeCustomerCapabilities.isDeleted(res)) {
      return false;
    }

    return Boolean(res.subscriptions?.data.find(subscription => {
      return subscription.items.data.find(i => i.price.id === planId);
    }));
  }

  static isDeleted(customer: Stripe.Customer | Stripe.DeletedCustomer): customer is Stripe.DeletedCustomer {
    return Boolean(customer.deleted);
  }
}
