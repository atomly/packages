// Libraries
import { Stripe } from 'stripe';
import { omitBy, isNil } from 'lodash';

// Relatives
import { CrudServiceListResponse, Subscription, SubscriptionService, SubscriptionServiceCreateParams, SubscriptionServiceListParams, SubscriptionServiceUpdateParams } from '../../lib';
import { CollectionMethod, SubscriptionStatus } from 'src/utils/enums';

export class StripeSubscriptionService implements SubscriptionService {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  public async create(params: SubscriptionServiceCreateParams): Promise<Subscription> {
    const res = await this.stripe.subscriptions.create({
      customer: params.customerId,
      default_payment_method: params.paymentMethodId,
      items: params.items.map(i => ({
        price: i.planId,
        quantity: i.quantity,
      })),
      collection_method: params.collectionMethod,
      days_until_due: params.daysUntilDue,
    });

    return {
      subscriptionId: res.id,
      customerId: res.customer as string,
      paymentMethodId: res.default_payment_method as string,
      items: res.items.data.map(i => ({
        subscriptionItemId: i.id,
        planId: i.price.id,
        quantity: i.quantity!,
      })),
      status: res.status as SubscriptionStatus,
      collectionMethod: res.collection_method as CollectionMethod,
      daysUntilDue: res.days_until_due as number,
      latestInvoiceId: res.latest_invoice as string,
    };
  }

  public async retrieve(subscriptionId: string): Promise<Subscription | null> {
    const res = await this.stripe.subscriptions.retrieve(subscriptionId);

    return {
      subscriptionId: res.id,
      customerId: res.customer as string,
      paymentMethodId: res.default_payment_method as string,
      items: res.items.data.map(i => ({
        subscriptionItemId: i.id,
        planId: i.price.id,
        quantity: i.quantity!,
      })),
      status: res.status as SubscriptionStatus,
      collectionMethod: res.collection_method as CollectionMethod,
      daysUntilDue: res.days_until_due as number,
      latestInvoiceId: res.latest_invoice as string,
    };
  }

  public async update(subscriptionId: string, params: SubscriptionServiceUpdateParams): Promise<Subscription> {
    // Omits empty properties.
    const { items, ...stripeParams }: Stripe.SubscriptionUpdateParams = omitBy(
      {
        default_payment_method: params.paymentMethodId,
        items: params.items?.map(i => ({
          id: i.subscriptionItemId,
          price: i.planId,
          quantity: i.quantity,
        })),
        collection_method: params.collectionMethod,
        days_until_due: params.daysUntilDue,
      } as Stripe.SubscriptionUpdateParams,
      isNil,
    );

    await Promise.all(items!.map(({ id: subscriptionItemId, ...item }) => this.stripe.subscriptionItems.update(subscriptionItemId!, item)))

    const res = await this.stripe.subscriptions.update(subscriptionId, stripeParams);

    return {
      subscriptionId: res.id,
      customerId: res.customer as string,
      paymentMethodId: res.default_payment_method as string,
      items: res.items.data.map(i => ({
        subscriptionItemId: i.id,
        planId: i.price.id,
        quantity: i.quantity!,
      })),
      status: res.status as SubscriptionStatus,
      collectionMethod: res.collection_method as CollectionMethod,
      daysUntilDue: res.days_until_due as number,
      latestInvoiceId: res.latest_invoice as string,
    };
  }

  public async delete(subscriptionId: string): Promise<boolean> {
    await this.stripe.subscriptions.del(subscriptionId);

    return true;
  }

  public async list(params: SubscriptionServiceListParams): Promise<CrudServiceListResponse<Subscription>> {
    const res = await this.stripe.subscriptions.list({
      customer: params.customerId,
      price: params.planId,
      status: params.status,
      collection_method: params.collectionMethod,
      created: params.created,
      ending_before: params.endingBefore,
      limit: params.limit,
      starting_after: params.startingAfter,
    });

    return {
      hasMore: res.has_more,
      data: res.data.map(subscription => ({
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
        paymentMethodId: subscription.default_payment_method as string,
        items: subscription.items.data.map(i => ({
          subscriptionItemId: i.id,
          planId: i.price.id,
          quantity: i.quantity!,
        })),
        status: subscription.status as SubscriptionStatus,
        collectionMethod: subscription.collection_method as CollectionMethod,
        daysUntilDue: subscription.days_until_due as number,
        latestInvoiceId: subscription.latest_invoice as string,
      })),
    };
  }
}
