export interface IEmailClient {
  checkSubscriptionList(listId: string): Promise<boolean>
  checkSubscription(listId: string, email: string): Promise<boolean>
  subscribeEmail(listId: string, email: string): Promise<boolean>
  subscribeEmailsBatch(emails: Array<string>): Promise<boolean>
}
