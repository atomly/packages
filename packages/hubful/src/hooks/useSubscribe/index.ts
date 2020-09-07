// Dependencies
import Hubful from '../../hub';

// Types
import { ISubscriberServiceSubscribeOptions, TSubscribeHandler } from '../../subscribers';
import { TStorageServicePayload } from '../../storages';

/**
 * Subscribes to a topic by mapping the topic handler function to it, then returns a
 * subscription ID necessary to unsubscribe from this topic.
 * @param topic - Subscription topic.
 * @param options - Options to filter topics if desired.
 * @returns Subscription ID of the registered handler.
 */
export async function useSubscribe<T = TStorageServicePayload>(
  topic: string,
  handler: TSubscribeHandler<T>,
  options?: ISubscriberServiceSubscribeOptions,
): Promise<string> {
  const subscriptionId = await Hubful.subscribe(topic, handler, options);
  return subscriptionId;
}
