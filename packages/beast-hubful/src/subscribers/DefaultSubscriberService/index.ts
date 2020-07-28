// Dependencies
import { parseTopic } from '../../utils';

// Types
import { TEventHandler } from '../../events';
import { ISubscriberServiceSubscribeOptions } from '../SubscriberService';
import { IDefaultSubscriberService } from './types';

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

  public async subscribe(topic: string, handler: TEventHandler, options: ISubscriberServiceSubscribeOptions = {}): Promise<string> {
    const parsedTopic = parseTopic(String(topic), options.filter);
    const subscriptionId = await this._eventsService.on(parsedTopic, handler, options);
    return subscriptionId;
  }

  public async unsubscribe(subscriptionId: string): Promise<boolean> {
    return await this._eventsService.remove(subscriptionId);
  }

  public async unsubscribeAll(topic?: string): Promise<boolean> {
    return await this._eventsService.removeAll(topic);
  }
}
