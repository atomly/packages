import { ISocketsService } from '../sockets';
import { IStorageService, IStorageServiceStoreOptions } from '../storages';

export interface ISubscriberServiceSubscribeOptions extends IStorageServiceStoreOptions {
  /**
   * Filters topics by a string identifier.
   */
  filter?: string
}

export interface ISubscriberService {
  /**
   * Hubful generic SocketsService.
   */
  _socketsService: ISocketsService
  /**
   * Hubful generic StorageService.
   */
  _storageService: IStorageService
  /**
   * Subscriptions map. It maps a unique subscription ID to a tuple composed of the topic and listener.
   */
  _subscriptions: Map<string, [string, (socketsService: ISocketsService) => Promise<void>]>;
  /**
   * Subscribes to a topic and generates a subscription ID that will be used to
   * map the topic and listener to the ID, then returns the ID.
   * @param topic - Subscription topic.
   * @param listener - Subscription listener.
   */
  subscribe(topic: string, listener: (socketsService: ISocketsService) => Promise<void>, options?: ISubscriberServiceSubscribeOptions): Promise<string>
  /**
   * Unsubscribes from a topic/listener by removing them from the subscriptions map and sockets service.
   * @param subscriptionId - The subscription ID needed to remove the subscription.
   */
  unsubscribe(subscriptionId: string): Promise<void>
}
