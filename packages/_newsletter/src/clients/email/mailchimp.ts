/* eslint-disable no-console */
// Libraries
import Mailchimp from 'mailchimp-api-v3';

// Types
import { IEmailClient } from './types';

// Dependencies
import md5 from 'md5';

/**
 * TODO: Add newsletter entities to our PostgreSQL database.
 */
export class MailchimpClient implements IEmailClient {
  private mailchimp: Mailchimp;

  constructor(apiKey: string) {
    this.mailchimp = new Mailchimp(apiKey);
  }

  public async checkSubscriptionList(listId: string): Promise<boolean> {
    try {
      const list = await this.mailchimp.get({
        path: `/lists/${listId}`,
      });
      return Boolean(list);
    } catch (error) {
      console.error(`ERROR: Something went wrong when fetching list [${listId}]: `, error.message);
      return false;
    }
  }

  public async checkSubscription(listId: string, email: string): Promise<boolean> {
    // Using the package md5 to create a hash to validate against the MailChimp API:
    const emailHash = md5(email);
    try {
      const list = await this.mailchimp.get({
        path: `/lists/${listId}/members/${emailHash}`,
      });
      return Boolean(list);
    } catch (error) {
      console.error(`ERROR: Something went wrong when checking the subscritipn of email [${email}] to list [${listId}]: `, error.message);
      return false;
    }
  }

  public async subscribeEmail(listId: string, email: string): Promise<boolean> {
    try {
      const result = await this.mailchimp.post(
        `/lists/${listId}/members`,
        {
          // eslint-disable-next-line @typescript-eslint/camelcase
          email_address: email,
          status: 'subscribed',
          // eslint-disable-next-line @typescript-eslint/camelcase
          merge_fields: {
            'CTA': 'NEWCLIENT',
            'FNAME': email,
            'LNAME': '',
            'BIRTHDAY': '',
          },
        },
      );
      return Boolean(result);
    } catch (error) {
      console.error(`ERROR: Something went wrong when subscribing email [${email}] to list [${listId}]: `, error.message);
      return false;
    }
  }

  /**
   * Not yet implemented.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async subscribeEmailsBatch(_: Array<string>): Promise<boolean> {
    return false;
  }
}
