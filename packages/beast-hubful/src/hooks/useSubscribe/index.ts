// Dependencies
import Hubful from '../../hub';

// Types
import { ISubscriberServiceSubscribeOptions } from '../../subscribers';

/**
 * Returns an instance of an AsyncIterator used to digest published events
 * on any topic(s). 
 * @param topic - Subscription topic or topics.
 * @param payload - Payload sent to the clients.
 */
export async function useSubscribe(): Promise<void> {
  await Hubful.subscriberService.subscribe();
}
