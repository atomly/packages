// Dependencies
import Hubful from '../../hub';

/**
 * Closes the connections of the Events and Storage services.
 * @param callback - The callback argument is optional and will be called when all connections are closed.
 */
export async function useShutdown(callback?: () => void): Promise<void> {
  await Hubful.shutdown(callback);
}
