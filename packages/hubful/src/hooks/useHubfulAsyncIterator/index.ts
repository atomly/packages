// Dependencies
import Hubful, { IHubfulService } from '../../hub';

// Types
import { TStorageServicePayload } from '../../storages';
import { HubfulAsyncIterator, IHubfulAsyncIterator } from '../../asyncIterators';

/**
 * Digests Hubful topic payloads via the IHubfulAsyncIterator interface.
 * @param topic - Subscription topic.
 * @param options - Options to filter topics if desired.
 * @returns Subscription ID of the registered handler.
 */
export function useHubfulAsyncIterator<T = TStorageServicePayload>(
  topic: string,
  hubful?: IHubfulService,
): IHubfulAsyncIterator<T> {
  return new HubfulAsyncIterator<T>({
    hubful: hubful ?? Hubful,
    topics: topic,
  });
}
