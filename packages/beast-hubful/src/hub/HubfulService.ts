// Types
import { IHubfulService, ETopicsEnum } from './types';

export class HubfulService<E extends ETopicsEnum<E> = undefined> implements IHubfulService {
  public socketsService: IHubfulService['socketsService'];
  public storageService: IHubfulService['storageService'];
  public publisherService: IHubfulService['publisherService'];
  public subscriberService: IHubfulService['subscriberService'];
  public topics?: IHubfulService['_topics'];

  public async setup(args: {
    socketsService: IHubfulService['socketsService']
    storageService: IHubfulService['storageService']
    publisherService: IHubfulService['publisherService']
    subscriberService: IHubfulService['subscriberService']
    topics?: IHubfulService['_topics']
  }): Promise<void> {
    // Binding properties to arguments:
    this.socketsService = args.socketsService;
    this.storageService = args.storageService;
    this.publisherService = args.publisherService;
    this.subscriberService = args.subscriberService;
    this.topics = args.topics;
    // Initiating services:
    await Promise.all([
      this.socketsService.on(
        'connection',
        async socketsService => {
          this.socketsService = socketsService;
        },
      ),
      this.storageService.connect(),
    ]);
  }

  public async shutdown(callback?: () => void): Promise<void> {
    // Initiating services:
    await Promise.all([
      this.socketsService.close(callback),
      this.storageService.disconnect(),
    ]);
  }
}
