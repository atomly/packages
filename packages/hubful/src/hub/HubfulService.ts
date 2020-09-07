// Types
import { IPublisherService } from '../publishers';
import { IEventsService } from '../events';
import { IStorageService } from '../storages';
import { ISubscriberService } from '../subscribers';

export enum EHubfulServiceStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

export interface IHubfulService {
  /**
   * Hubful instance status.
   */
  status: EHubfulServiceStatus
  /**
   * Handles incoming events depenting on the event types/messages/topics,
   * executes the respective registered event handlers, and removes events,
   * and emits events.
   */
  eventsService: IEventsService
  /**
   * Storage to hold data for a short duration in case the subscriber
   * is slow, it still has a window to consume it.
   * e.g. Redis supports short-lived data. It has the capabilities to initiate,
   * update and auto-expire. It also puts less load on the application.
   */
  storageService: IStorageService
  /**
   * This service pushes data to the Hub. All the request payloads are captured
   * by this component which writes to the StorageService.
   */
  publisherService: IPublisherService
  /**
   * This service reads data from the StorageService. It is also the web server
   * for clients to connect via WebSocket (or HTTP) to get data and
   * then sends it to clients or vice-versa.
   */
  subscriberService: ISubscriberService
  /**
   * Binds the arguments to the Hub properties and sets up the Sockets
   * and Storage services.
   * @param args - Object containing the Hubful services.
   */
  setup(args: {
    eventsService: IHubfulService['eventsService']
    storageService: IHubfulService['storageService']
    publisherService: IHubfulService['publisherService']
    subscriberService: IHubfulService['subscriberService']
  }): Promise<void>
  /**
   * Closes the connections of the Events and Storage services.
   * @param callback - The callback argument is optional and will be called when all connections are closed.
   */
  shutdown(callback?: () => void): Promise<void>
  /**
   * Publishes a payload to clients subscribed to the topic.
   * @param topic - Topic identifier string.
   * @param payload - Payload sent to the clients.
   * @param options - Options to filter the topic, or set expiracy on the payload.
   */
  publish: IPublisherService['publish']
  /**
   * Subscribes to a topic by mapping the topic handler function to it, then returns a
   * subscription ID necessary to unsubscribe from this topic.
   * @param topic - Subscription topic.
   * @param options - Options to filter topics if desired.
   * @returns Subscription ID of the registered handler.
   */
  subscribe: ISubscriberService['subscribe']
  /**
   * Unsubscribes a handler based on its subscription ID.
   * @param subscriptionId - ID of the registered handler.
   * @returns `true` if the topic was successfully unsubscribed, `false` if it failed.
   */
  unsubscribe: ISubscriberService['unsubscribe']
}
