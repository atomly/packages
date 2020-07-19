// Libraries
import { v4 } from 'uuid';

/**
 * Generates a unique string identifier using a PubSub topic parameter.
 * @param topic - PubSub topic used that will be composed with a unique UUID.
 * @param topic - Optional topic filter.
 */
export function generateTopicUUID(topic: string, filter?: string | number): string {
  if (filter) {
    return `${topic}_${filter}_${v4()}`;
  }
  return `${topic}_${v4()}`;
}
