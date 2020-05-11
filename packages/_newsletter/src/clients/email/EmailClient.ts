/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */

// Types
import { IEmailClient } from './types';
import { ICreateList, IUpdateList, IUpdateSubscription } from '../../schemas';

export abstract class EmailClient implements IEmailClient {
  static errorHandler(header: string, mailchimpError: unknown): unknown {
    // Logging errors
    console.error(
      `ERROR >>> ${header}`,
      JSON.stringify(mailchimpError, null, 2),
    );
    return mailchimpError;
  }

  public listId?: string;

  constructor(args: {
    apiKey: string,
    listId?: string,
  }) {
    this.listId = args.listId;
  }

  /**
   * Updates the subscription list ID of the MailchimpClient.
   * @param listId - New subscription list ID.
   */
  public setListId(listId: string): EmailClient {
    this.listId = listId;
    return this;
  }

  /**
   * Creates a subscription list.
   * @param listId - Subscription list ID.
   */
  public abstract async getSubscriptionLists(): Promise<unknown>

  /**
   * Fetches a subscription list.
   * @param listId - Subscription list ID.
   */
  public abstract async getSubscriptionList(listId: string): Promise<unknown>

  /**
   * Creates a subscription list.
   * @param listId - Subscription list ID.
   */
  public abstract async createSubscriptionList(data: ICreateList): Promise<unknown>

  /**
   * Updates a subscription list.
   * @param listId - Subscription list ID.
   */
  public abstract async updateSubscriptionList(listId: string, data: IUpdateList): Promise<unknown>

  // /**
  //  * NOT RECOMMENDED.
  //  * Deletes a subscription list.
  //  * @param listId - Subscription list ID.
  //  */
  // public abstract async deleteSubscriptionList(listId: string): Promise<unknown>

  /**
   * Fetches the emails of a subscription list.
   * @param listId - Subscription list ID.
   * @param query - Filter query string.
   */
  public abstract async getSubscriptionListEmails(listId: string, query: string): Promise<unknown>

  /**
   * Fetches subscribed email to the list.
   * @param email - Subscribed user email.
   * @param listId - Subscription list ID.
   */
  public abstract async getSubscription(email: string, listId?: string): Promise<unknown>

  /**
   * Subscribes a user to a subscription list.
   * @param email - User email.
   * @param listId - Subscription list ID.
   */
  public abstract async postSubscription(email: string, listId?: string): Promise<unknown>

  // /**
  //  * NOT YET IMPLEMENTED.
  //  * Updates a subscribed a user to a subscription list.
  //  * @param email - User email.
  //  * @param listId - Subscription list ID.
  //  */
  // public abstract async updateSubscription(email: string, listId: string): Promise<unknown>

  /**
   * Unsubscribes a user from a subscription list.
   * @param email - User email.
   * @param listId - Subscription list ID.
   */
  public abstract async updateSubscription(email: string, data: IUpdateSubscription, listId?: string): Promise<unknown>

  // /**
  //  * NOT YET IMPLEMENTED.
  //  * Subscribes many users to a subscription list.
  //  * @param emails - User emails array.
  //  * @param listId - Subscription list ID.
  //  */
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // public abstract async subscribeEmailsBatch(_: Array<string>): Promise<boolean>

  // /**
  //  * NOT YET IMPLEMENTED.
  //  * Unsubscribes many users from a subscription list.
  //  * @param emails - User emails array.
  //  * @param listId - Subscription list ID.
  //  */
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // public abstract async unsubscribeEmailsBatch(_: Array<string>): Promise<boolean>
}
