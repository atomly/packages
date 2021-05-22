import { CollectionMethod, SubscriptionStatus } from 'src/utils/enums';
import { CrudService, CrudServiceListParams, CrudServiceListResponse } from './CrudService';
import { Subscription } from './Subscription';

export interface SubscriptionService extends CrudService {
  /**
   * Creates a new subscription on an existing customer. Each customer can have up to 500 active or scheduled subscriptions.
   */
  create(params: SubscriptionServiceCreateParams): Promise<Subscription>;

  /**
   * Retrieves the subscription with the given ID.
   */
  retrieve(subscriptionId: string): Promise<Subscription | null>;

  /**
   * Updates an existing subscription to match the specified parameters. When changing prices or quantities, we will optionally prorate the price we charge next month to make up for any price changes.
   *
   * For example, if a customer signs up on May 1 for a $100 price, she'll be billed $100 immediately. If on May 15 she switches to a $200 price, then on June 1 she'll be billed $250 ($200 for a renewal of her subscription, plus a $50 prorating adjustment for half of the previous month's $100 difference). Similarly, a downgrade will generate a credit to be applied to the next invoice. We also prorate when you make quantity changes.
   */
  update(subscriptionId: string, params: SubscriptionServiceUpdateParams): Promise<Subscription>;

  /**
   * Cancels a customer’s subscription immediately. The customer will not be charged again for the subscription.
   *
   * Note, however, that any pending invoice items that you’ve created will still be charged for at the end of the period, unless manually deleted. If you’ve set the subscription to cancel at the end of the period, any pending prorations will also be left in place and collected at the end of the period. But if the subscription is set to cancel immediately, pending prorations will be removed.
   */
  delete(subscriptionId: string): Promise<boolean>;

  /**
   * By default, returns a list of subscriptions that have not been canceled. In order to list canceled subscriptions, specify status=canceled.
   */
  list(params: SubscriptionServiceListParams): Promise<CrudServiceListResponse<Subscription>>;
}

export type SubscriptionServiceCreateParams = Omit<Subscription, 'subscriptionId' | 'status'>;

export interface SubscriptionServiceListParams extends CrudServiceListParams {
  /**
   * The ID of the customer whose subscriptions will be retrieved.
   */
  customerId?: string;
  /**
   * Filter for subscriptions that contain this recurring price ID.
   */
  priceId?: string;
  /**
   * The status of the subscriptions to retrieve. Passing in a value of canceled will return all canceled subscriptions, including those belonging to deleted customers.
   */
  status?: SubscriptionStatus;
  /**
   * The collection method of the subscriptions to retrieve. Either charge_automatically or send_invoice.
   */
  collectionMethod?: CollectionMethod;
  /**
   * A filter on the list based on the object created field. The value can be a string with an integer Unix timestamp, or it can be a dictionary with the following options:
   */
  created?:
    | number
    | {
      /**
       * Return results where the created field is greater than this value.
       */
      gt?: number;
      /**
       * Return results where the created field is greater than or equal to this value.
       */
      gte?: number;
      /**
       * Return results where the created field is less than this value.
       */
      lt?: number;
      /**
       * Return results where the created field is less than or equal to this value.
       */
      lte?: number;
    }
};

export type SubscriptionServiceUpdateParams = Partial<Pick<Subscription, 'paymentMethodId' | 'items' | 'collectionMethod'>>;
