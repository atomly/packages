// Types
import { IHubfulService } from './HubfulService';

export class DefaultHubfulService implements IHubfulService {
  public eventsService: IHubfulService['eventsService'];
  public storageService: IHubfulService['storageService'];
  public publisherService: IHubfulService['publisherService'];
  public subscriberService: IHubfulService['subscriberService'];

  public async setup(args: {
    eventsService: IHubfulService['eventsService']
    storageService: IHubfulService['storageService']
    publisherService: IHubfulService['publisherService']
    subscriberService: IHubfulService['subscriberService']
  }): Promise<void> {
    // Binding properties to arguments:
    this.eventsService = args.eventsService;
    this.storageService = args.storageService;
    this.publisherService = args.publisherService;
    this.subscriberService = args.subscriberService;
    // Initiating services:
    await Promise.all([
      this.eventsService.start(),
      this.storageService.connect(),
    ]);
  }

  public async shutdown(callback?: () => void): Promise<void> {
    // Initiating services:
    await Promise.all([
      this.eventsService.close(callback),
      this.storageService.disconnect(),
    ]);
  }
}
