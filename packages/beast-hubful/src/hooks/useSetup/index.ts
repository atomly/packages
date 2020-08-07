// Dependencies
import Hubful, { IHubfulService } from '../../hub';

/**
 * Binds the arguments to the Hub properties and sets up the Sockets
 * and Storage services.
 * @param args - Object containing the Hubful services.
 */
export async function useSetup(args: {
  eventsService: IHubfulService['eventsService']
  storageService: IHubfulService['storageService']
  publisherService: IHubfulService['publisherService']
  subscriberService: IHubfulService['subscriberService']
}): Promise<void> {
  await Hubful.setup(args);
}
