import { IEventsService, TEventHandler, IEventsServiceOptions } from '../events';
import { IStorageService } from '../storages';

export interface ISubscriberServiceSubscribeOptions extends IEventsServiceOptions {
  /**
   * Filters topics by a string identifier.
   */
  filter?: string
}

export interface ISubscriberService {
  /**
   * Hubful generic EventsService.
   */
  _eventsService: IEventsService;
  /**
   * Hubful generic StorageService.
   */
  _storageService: IStorageService;
  /**
   * Subscribes to a topic by mapping the topic handler function to it, then returns a
   * subscription ID necessary to unsubscribe from this topic.
   * @param topic - Subscription topic.
   * @param options - Options to filter topics if desired.
   * @returns Subscription ID of the registered handler.
   */
  subscribe(topic: string, handler: TEventHandler, options?: ISubscriberServiceSubscribeOptions): Promise<string>
  /**
   * Unsubscribes a handler based on its subscription ID.
   * @param subscriptionId - ID of the registered handler.
   * @returns `true` if the topic was successfully unsubscribed, `false` if it failed.
   */
  unsubscribe(subscriptionId: string): Promise<boolean>
  /**
   * Unsubscribes from all topics or from a specific topic.
   * @param topic - Subscription topic.
   * @returns `true` if the handlers were successfully removed, `false` if the topic is invalid.
   */
  unsubscribeAll(topic?: string): Promise<boolean>
}
