// Dependencies
import Hubful from '../../hub';

// Types
import { ISubscriberServiceSubscribeOptions } from '../../subscribers';

/**
 * TODO: useSubscribe should return an AsyncIterator.
 */
export async function useSubscribe(): Promise<void> {
  await Hubful.subscriberService.subscribe();
}
