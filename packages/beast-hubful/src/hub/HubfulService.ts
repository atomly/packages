// Types
import { IPublisherService } from '../publishers';
import { IEventsService } from '../events';
import { IStorageService } from '../storages';
import { ISubscriberService } from '../subscribers';

export interface IHubfulService {
  /**
   * Used to allow real-time connections from front-end clients to the server.
   * It allows:
   * - 1 socket per client.
   * - Sockets can have many events (topics), for the PubSub system.
   * - Can initiate/store, update and auto-expire payloads.
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
   * The entity that pulls data from the Hub. All the request
   * responses are captured by this component which writes to
   * the StorageService.
   */
  publisherService: IPublisherService
  /**
   * This reads data from the StorageService. It is also the web server
   * for clients to connect via WebSocket (or HTTP) to get data and
   * then sends it to clients.
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
   * Closes the connections of the Sockets and Storage services.
   * @param callback - The callback argument is optional and will be called when all
   * Sockets client connections are closed.
   */
  shutdown(callback?: () => void): Promise<void>
}
