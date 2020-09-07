// Types
import { TStorageServicePayload } from '../storages';
import { IPublisherServicePublishOptions } from '../publishers';
import { ISubscriberServiceSubscribeOptions, TSubscribeHandler } from '../subscribers';
import { IHubfulService, EHubfulServiceStatus } from './HubfulService';

export class DefaultHubfulService implements IHubfulService {
  public status: IHubfulService['status'];
  public eventsService: IHubfulService['eventsService'];
  public storageService: IHubfulService['storageService'];
  public publisherService: IHubfulService['publisherService'];
  public subscriberService: IHubfulService['subscriberService'];

  constructor() {
    this.status = EHubfulServiceStatus.DISCONNECTED;
  }

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
    this.status = EHubfulServiceStatus.CONNECTED;
  }

  public async publish(topic: string, payload: TStorageServicePayload, options: IPublisherServicePublishOptions = {}): Promise<void> {
    return await this.publisherService.publish(topic, payload, options);
  }

  public async subscribe<T = TStorageServicePayload>(topic: string, handler: TSubscribeHandler<T>, options: ISubscriberServiceSubscribeOptions = {}): Promise<string> {
    return await this.subscriberService.subscribe(topic, handler, options);
  }

  public async unsubscribe(subscriptionId: string): Promise<boolean> {
    return await this.subscriberService.unsubscribe(subscriptionId);
  }

  public async shutdown(callback?: () => void): Promise<void> {
    // Initiating services:
    await Promise.all([
      this.eventsService.close(callback),
      this.storageService.disconnect(),
    ]);
    this.status = EHubfulServiceStatus.DISCONNECTED;
  }
}
