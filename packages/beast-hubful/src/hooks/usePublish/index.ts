// Dependencies
import Hubful from '../../hub';

// Types
import { IPublisherServicePublishOptions } from '../../publishers';

/**
 * Publishes a payload to clients subscribed to the topic.
 * @param topic - Topic identifier string.
 * @param payload - Payload sent to the clients.
 * @param options - Options to filter the topic, or set expiracy on the payload.
 */
export async function usePublish(topic: string, payload: unknown, options?: IPublisherServicePublishOptions): Promise<void> {
  await Hubful.publisherService.publish(topic, payload, options);
}
