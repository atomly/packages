// Dependencies
import { parseTopic } from '../../utils';

// Types
import { TEventHandler } from '../../events';
import { ISubscriberServiceSubscribeOptions } from '../SubscriberService';
import { TSubscribeHandler } from '../types';
import { IDefaultSubscriberService } from './types';
import { TStorageServicePayload } from '../../storages';

export class DefaultSubscriberService implements IDefaultSubscriberService {
  public _eventsService: IDefaultSubscriberService['_eventsService'];
  public _storageService: IDefaultSubscriberService['_storageService'];

  constructor(
    args: {
      eventsService: IDefaultSubscriberService['_eventsService']
      storageService: IDefaultSubscriberService['_storageService']
    },
  ) {
    this._eventsService = args.eventsService;
    this._storageService = args.storageService;
  }

  public async subscribe<T = TStorageServicePayload>(topic: string, handler: TSubscribeHandler<T>, options: ISubscriberServiceSubscribeOptions = {}): Promise<string> {
    const parsedTopic = parseTopic(String(topic), options.filter);
    const subscriptionId = await this._eventsService.on(
      parsedTopic,
      this.onSubscribeHandler(handler),
      options,
    );
    return subscriptionId;
  }

  public async unsubscribe(subscriptionId: string): Promise<boolean> {
    return await this._eventsService.remove(subscriptionId);
  }

  public async unsubscribeAll(topic?: string): Promise<boolean> {
    return await this._eventsService.removeAll(topic);
  }

  /**
   * Generates a subscription handler middleware that retrieves the published
   * payload from the Storage Service, then forwards that payload to the subscribed
   * handlers.
   * @param subscribeHandler 
   */
  private onSubscribeHandler<T = TStorageServicePayload>(subscribeHandler: TSubscribeHandler<T>): TEventHandler {
    return async (topic: string, key: string): Promise<void> => {
      const payload = await this._storageService.get(key) as T;
      subscribeHandler(topic, payload);
    };
  }
}
