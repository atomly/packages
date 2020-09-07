// Dependencies
import Hubful from '../../hub';

// Types
import { IPublisherServicePublishOptions } from '../../publishers';
import { TStorageServicePayload } from '../../storages';

/**
 * Publishes a payload to clients subscribed to the topic.
 * @param topic - Topic identifier string.
 * @param payload - Payload sent to the clients.
 * @param options - Options to filter the topic, or set expiracy on the payload.
 */
export async function usePublish(
  topic: string,
  payload: TStorageServicePayload,
  options?: IPublisherServicePublishOptions,
): Promise<void> {
  await Hubful.publish(topic, payload, options);
}
