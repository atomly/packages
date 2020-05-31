/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
// Libraries
import Mailchimp from 'mailchimp-api-v3';

// Types
import { EmailClient } from './EmailClient';
import { ICreateList, IUpdateList, IUpdateSubscription } from '../../schemas';

// Dependencies
import md5 from 'md5';

export class MailchimpClient extends EmailClient {
  private mailchimp: Mailchimp;
  public listId?: string;

  constructor(args: {
    apiKey: string,
    listId?: string,
  }) {
    super(args);
    this.mailchimp = new Mailchimp(args.apiKey);
  }

  /**
   * Creates a subscription list.
   * @param listId - Subscription list ID.
   */
  public async getSubscriptionLists(): Promise<unknown> {
    try {
      const result = await this.mailchimp.get('/lists/');
      return result;
    } catch (error) {
      return MailchimpClient.errorHandler(
        `Something went wrong while fetching lists: `,
        error,
      );
    }
  }

  /**
   * Fetches a subscription list.
   * @param listId - Subscription list ID.
   */
  public async getSubscriptionList(listId: string): Promise<unknown> {
    try {
      const result = await this.mailchimp.get(`/lists/${this.listId ?? listId}`);
      return result;
    } catch (error) {
      return MailchimpClient.errorHandler(
        `Something went wrong while fetching list [${this.listId ?? listId}]: `,
        error,
      );
    }
  }

  /**
   * Creates a subscription list.
   * @param listId - Subscription list ID.
   */
  public async createSubscriptionList(data: ICreateList): Promise<unknown> {
    try {
      const result = await this.mailchimp.post(
        '/lists/',
        data,
      );
      return result;
    } catch (error) {
      return MailchimpClient.errorHandler(
        `Something went wrong while creating list [${data.name}]: `,
        error,
      );
    }
  }

  /**
   * Updates a subscription list.
   * @param listId - Subscription list ID.
   */
  public async updateSubscriptionList(listId: string, data: IUpdateList): Promise<unknown> {
    try {
      const result = await this.mailchimp.patch(
        `/lists/${this.listId ?? listId}`,
        data,
      );
      return result;
    } catch (error) {
      return MailchimpClient.errorHandler(
        `Something went wrong while creating list [${data.name}]: `,
        error,
      );
    }
  }

  // /**
  //  * NOT RECOMMENDED.
  //  * Deletes a subscription list.
  //  * @param listId - Subscription list ID.
  //  */
  // public async deleteSubscriptionList(listId: string): Promise<unknown> {
  //   try {
  //     const result = await this.mailchimp.delete(`/lists/${this.listId ?? listId}`);
  //     return result;
  //   } catch (error) {
  //     return MailchimpClient.errorHandler(
  //       `Something went wrong while deleting list [${this.listId ?? listId}]: `,
  //       error,
  //     );
  //   }
  // }

  /**
   * Fetches the emails of a subscription list.
   * @param listId - Subscription list ID.
   * @param query - Filter query string.
   */
  public async getSubscriptionListEmails(listId: string, query = '@'): Promise<unknown> {
    try {
      const result = await this.mailchimp.get({
        path: `/search-members?list_id=${listId}&query=${query}`,
      });
      return result;
    } catch (error) {
      return MailchimpClient.errorHandler(
        `Something went wrong while fetching list [${this.listId ?? listId}] emails: `,
        error,
      );
    }
  }

  /**
   * Fetches subscribed email to the list.
   * @param email - Subscribed user email.
   * @param listId - Subscription list ID.
   */
  public async getSubscription(email: string, listId?: string): Promise<unknown> {
    // Using the package md5 to create a hash to validate against the MailChimp API:
    const emailHash = md5(email.toLowerCase());
    try {
      const result = await this.mailchimp.get({
        path: `/lists/${this.listId ?? listId}/members/${emailHash}`,
      });
      return result;
    } catch (error) {
      return MailchimpClient.errorHandler(
        `Something went wrong when checking the subscritipn of user [${email}] to list [${this.listId ?? listId}]: `,
        error,
      );
    }
  }

  /**
   * Subscribes a user to a subscription list.
   * @param email - User email.
   * @param listId - Subscription list ID.
   */
  public async postSubscription(email: string, listId?: string): Promise<unknown> {
    try {
      const result = await this.mailchimp.post(
        `/lists/${this.listId ?? listId}/members`,
        {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            'CTA': 'NEWCLIENT',
            'FNAME': email,
            'LNAME': '',
            'BIRTHDAY': '',
          },
        },
      );
      return result;
    } catch (error) {
      return MailchimpClient.errorHandler(
        `Something went wrong when subscribing email [${email}] to list [${this.listId ?? listId}]: `,
        error,
      );
    }
  }

  // /**
  //  * NOT YET IMPLEMENTED.
  //  * Updates a subscribed a user to a subscription list.
  //  * @param email - User email.
  //  * @param listId - Subscription list ID.
  //  */
  // public async updateSubscription(email: string, listId: string): Promise<unknown> {
  //   // Using the package md5 to create a hash to validate against the MailChimp API:
  //   const emailHash = md5(email.toLowerCase());
  //   try {
  //     const result = await this.mailchimp.post(
  //       `/lists/${this.listId ?? listId}/members/${emailHash}`,
  //       {
  //         // eslint-disable-next-line @typescript-eslint/camelcase
  //         email_address: email,
  //         status: 'subscribed',
  //         // eslint-disable-next-line @typescript-eslint/camelcase
  //         merge_fields: {
  //           'CTA': 'NEWCLIENT',
  //           'FNAME': email,
  //           'LNAME': '',
  //           'BIRTHDAY': '',
  //         },
  //       },
  //     );
  //     return result;
  //   } catch (error) {
  //     console.error(`Something went wrong when subscribing email [${email}] to list [${this.listId ?? listId}]: `, error.message);
  //     return false;
  //   }
  // }

  /**
   * Unsubscribes a user from a subscription list.
   * @param email - User email.
   * @param listId - Subscription list ID.
   */
  public async updateSubscription(email: string, data: IUpdateSubscription, listId?: string): Promise<unknown> {
    // Using the package md5 to create a hash to validate against the MailChimp API:
    const emailHash = md5(email.toLowerCase());
    try {
      const result = await this.mailchimp.patch(
        `/lists/${this.listId ?? listId}/members/${emailHash}`,
        data,
      );
      return result;
    } catch (error) {
      return MailchimpClient.errorHandler(
        `Something went wrong when unsubscribing email [${email}] to list [${this.listId ?? listId}]: `,
        error,
      );
    }
  }

  // /**
  //  * NOT YET IMPLEMENTED.
  //  * Subscribes many users to a subscription list.
  //  * @param emails - User emails array.
  //  * @param listId - Subscription list ID.
  //  */
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // public async subscribeEmailsBatch(_: Array<string>): Promise<boolean> {
  //   return false;
  // }

  // /**
  //  * NOT YET IMPLEMENTED.
  //  * Unsubscribes many users from a subscription list.
  //  * @param emails - User emails array.
  //  * @param listId - Subscription list ID.
  //  */
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // public async unsubscribeEmailsBatch(_: Array<string>): Promise<boolean> {
  //   return false;
  // }
}
