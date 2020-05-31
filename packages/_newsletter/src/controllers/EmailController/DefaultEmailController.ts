// Types
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import { DBContext } from '@beast/beast-collections';
import {
  ISubscribeEmail,
  // ISubscribeEmailsBatch,
} from '../../schemas/types';
import { EmailClient } from '../../clients/email';
import { EmailController } from './EmailController';

export class DefaultEmailController implements EmailController {
  private emailClient: EmailClient;

  constructor(args: {
    emailClient: EmailClient,
  }) {
    this.emailClient = args.emailClient;
    // Bindings
    this.getLists = this.getLists.bind(this);
    this.getList = this.getList.bind(this);
    this.createList = this.createList.bind(this);
    this.updateList = this.updateList.bind(this);
    // this.deleteList = this.deleteList.bind(this);

    this.getListSubscribedEmails = this.getListSubscribedEmails.bind(this);

    this.getSubscribedEmail = this.getSubscribedEmail.bind(this);
    this.subscribeEmail = this.subscribeEmail.bind(this);
    this.unsubscribeEmail = this.unsubscribeEmail.bind(this);
    // this.subscribeEmailsBatch = this.subscribeEmailsBatch.bind(this);
    // this.unsubscribeEmailsBatch = this.unsubscribeEmailsBatch.bind(this);
  }

  private dbContext: DBContext;

  /**
   * Sets up a DB Context private member.
   * @param args - Setup parameters.
   */
  public async setup(args: { dbContext: DBContext }): Promise<void> {
    this.dbContext = args.dbContext;
  }

  public async getLists(_: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.emailClient.getSubscriptionLists();
      res.json(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      next(err);
    }
  }

  public async getList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.emailClient.getSubscriptionList(req.params.id);
      res.json(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      next(err);
    }
  }

  public async createList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.emailClient.createSubscriptionList(req.body);
      res.json(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      next(err);
    }
  }

  public async updateList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.emailClient.updateSubscriptionList(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      next(err);
    }
  }

  // /**
  //  * NOT RECOMMENDED.
  //  * Deletes a subscription list.
  //  */
  // public async deleteList(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const result = await this.emailClient.deleteSubscriptionList(req.params.id);
  //     res.json(result);
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.error(err);
  //     next(err);
  //   }
  // }

  public async getListSubscribedEmails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.emailClient.getSubscriptionListEmails(req.params.id, req.query.query as string);
      res.json(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      next(err);
    }
  }

  public async getSubscribedEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.emailClient.getSubscription(req.params.email, req.query.list_id as string | undefined);
      res.json(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      next(err);
    }
  }

  public async subscribeEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Try to subscribe:
    try {
      const {
        email,
        full_name: fullName,
        reference,
        list_id: listId,
      } = req.body as ISubscribeEmail;
      let result: unknown;
      // First, check if the user is subscribed. If the user is not subscribed,
      // create a new subscription. Otherwise, update the existing one.
      const entity = await this.dbContext.models.Subscriber.findOne({
        email: {
          $eq: email,
        }
      });
      if (entity) {
        result = await this.emailClient.updateSubscription(email, { status: 'subscribed'}, listId);
      } else {
        [result] = await Promise.all([
          this.emailClient.postSubscription(email, listId),
          this.dbContext.models.Subscriber.create({ email, fullName, reference }),
        ]);
      }
      res.json(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      next(err);
    }
  }

  public async unsubscribeEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        email,
        list_id: listId,
      } = req.body as ISubscribeEmail;
      const result = await this.emailClient.updateSubscription(email, { status: 'unsubscribed' }, listId);
      res.json(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      next(err);
    }
  }

  // public async subscribeEmailsBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const {
  //       emails,
  //     } = req.body as ISubscribeEmailsBatch;

  //     // eslint-disable-next-line no-console
  //     console.log('email: ', emails);
    
  //     res.json(emails);
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.error(err);
  //     next(err);
  //   }
  // }

  // public async unsubscribeEmailsBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const {
  //       emails,
  //     } = req.body as ISubscribeEmailsBatch;

  //     // eslint-disable-next-line no-console
  //     console.log('email: ', emails);
    
  //     res.json(emails);
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.error(err);
  //     next(err);
  //   }
  // }
}
