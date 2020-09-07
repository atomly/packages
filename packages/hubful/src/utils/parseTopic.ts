/**
 * Parses a topic and filters it if necessary.
 * @param topic - PubSub topic.
 * @param topic - Optional topic filter.
 */
export function parseTopic(topic: string, filter?: string | number): string {
  if (filter) {
    return `${topic}_${filter}`;
  }
  return `${topic}`;
}
