import { IHubfulService } from '../hub';
import { ISubscriberServiceSubscribeOptions } from '../subscribers';
import { TStorageServicePayload } from '../storages';

export interface IAsyncIterator<T = TStorageServicePayload> extends AsyncIterator<T> {
  /**
   * A queue of resolve functions waiting for an incoming topic payload which has not yet arrived.
   * This queue expands as next() calls are made without Hubful topic payloads arriving in between.
   */
  pullQueue: Function[];
  /**
   * A queue of Hubful topics waiting for next() calls to be made.
   * This queue expands as Hubful topics arrive without next() calls occurring in between.
   */
  pushQueue: unknown[];
  /**
   * An array of Hubful topics which this AsyncIterator should watch.
   */
  topicsArray: string[];
  /**
   * A list of all subscription IDs generated by this AsyncIterator.
   */
  subscriptionIds: string[] | undefined;
  /**
   * Whether or not the AsynIterator is in listening mode (responding to
   * incoming Hubful topic payloads and next() calls).
   * Listening begins as `true` and `turns` to false once the return method is called.
   */
  isListening: boolean;
  /**
   * The Hubful instance whose topics will be observed.
   */
  hubful: IHubfulService
  /**
   * Subscriber Service (`subscribe`) options to filter topics if desired.
   */
  options?: ISubscriberServiceSubscribeOptions
  /**
   * Handles incoming payloads from the HubfulService, if the `pullQueue`
   * is empty, it will push the value into the `pushQueue`.
   * Otherwise, the payload is sent to the first `pullQueue` resolve
   * function waiting for a payload.
   * @param _ - Topic name, not used.
   * @param payload - Published payload of the subscribed topic.
   */
  pushValue(_: string, payload: T): Promise<void>
  /**
   * Resolves and pushes `T` values from the `pushQueue`.
   * If there are values in the `pushQueue`, it will pull out the oldest payload
   * and resolve it.
   * Otherwise, it will push the resolve function to the `pullQueue` while it waits
   * for the payload.
   */
  pullValue(): Promise<IteratorResult<T>>
  /**
   * Stops listening for new payloads, unsubscribes all of the stored `subscriptionIds`,
   * and empties all queues.
   */
  emptyQueue(): Promise<void>
  /**
   * Subscribes to all of the received topics in the constructor stored in `topicsArray`.
   * The `pushValue` function will handle the topic events and incoming respective payloads.
   * It returns an array of all of the subscription IDs.
   */
  subscribeAll(): Promise<string[]>
  /**
   * Array of subscription IDs that are needed to unsubscribe the topics.
   * @param subscriptionIds - Array of subscriptions IDs.
   */
  unsubscribeAll(subscriptionIds?: string[]): Promise<void>
}
