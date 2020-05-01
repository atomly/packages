import {
  ICreateList,
  IUpdateList,
  IUpdateSubscription,
} from '../../schemas';

export interface EmailClient {
  setListId(listId: string): EmailClient

  getSubscriptionLists(): Promise<unknown>
  getSubscriptionList(listId: string): Promise<unknown>
  createSubscriptionList(data: ICreateList): Promise<unknown>
  updateSubscriptionList(listId: string, data: IUpdateList): Promise<unknown>
  // deleteSubscriptionList(listId: string): Promise<unknown>

  getSubscriptionListEmails(listId: string, query: string): Promise<unknown>

  getSubscription(email: string, listId?: string): Promise<unknown>
  postSubscription(email: string, listId?: string): Promise<unknown>
  updateSubscription(email: string, data: IUpdateSubscription, listId?: string): Promise<unknown>
  // deleteSubscription(email: string, listId?: string): Promise<unknown>
  // subscribeEmailsBatch(emails: Array<string>): Promise<boolean>
  // unsubscribeEmailsBatch(emails: Array<string>): Promise<boolean>
}
