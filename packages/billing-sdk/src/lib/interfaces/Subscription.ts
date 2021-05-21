import { CollectionMethod, SubscriptionStatus } from '../../utils/enums';

/**
 * Subscriptions allow you to charge a customer on a recurring basis.
 */
export interface Subscription {
  subscriptionId: string;
  customerId: string;
  /**
    * Subscription items allow you to create customer subscriptions with more than one plan,
    * making it easy to represent complex billing relationships.
    */
  items: Array<{
    subscriptionItemId: string;
    priceId: string;
    quantity: number;
  }>;
  /**
   * Possible values are `incomplete`, `incomplete_expired`, `trialing`, `active`, `past_due`,
   * `canceled`, or `unpaid`.
   */
  status: SubscriptionStatus;
  /**
   * Either `charge_automatically`, or `send_invoice`. When charging automatically, Stripe will
   * attempt to pay this subscription at the end of the cycle using the default source attached
   * to the customer. When sending an invoice, Stripe will email your customer an invoice with
   * payment instructions.
   */
  collectionMethod: CollectionMethod;
  /**
   * Invoices are statements of amounts owed by a customer, and are either generated one-off, or
   * generated periodically from a subscription.
   */
  latestInvoiceId?: string;
}
