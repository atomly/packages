// Dependencies
import Hubful from '../../hub';

/**
 * Unsubscribes from a topic/listener by removing them from the subscriptions
 * map and events service.
 * @param subscriptionId - The subscription ID needed to remove the subscription.
 */
export async function useUnsubscribe(subscriptionId: string): Promise<boolean> {
  const result = await Hubful.unsubscribe(subscriptionId);
  return result;
}
