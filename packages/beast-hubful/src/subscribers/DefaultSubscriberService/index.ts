// Dependencies
import { generateSubscriptionUUID, parseTopic } from '../../utils/index';

// Types
import { KeyType } from '../../storages';
import { ISubscriberServiceSubscribeOptions } from '../SubscriberService';
import { IDefaultSubscriberService } from './types';

export class DefaultSubscriberService implements IDefaultSubscriberService {
  public _socketsService: IDefaultSubscriberService['_socketsService'];
  public _storageService: IDefaultSubscriberService['_storageService'];
  public _subscriptions: IDefaultSubscriberService['_subscriptions'];

  constructor(
    args: {
        _socketsService: IDefaultSubscriberService['_socketsService']
        _storageService: IDefaultSubscriberService['_storageService']
    },
  ) {
    this._socketsService = args._socketsService;
    this._storageService = args._storageService;
    this._subscriptions = new Map();
  }

  public async subscribe(topic: KeyType, listener: (socketsService: IDefaultSubscriberService['_socketsService']) => Promise<void>, options: ISubscriberServiceSubscribeOptions): Promise<string> {
    const parsedTopic = parseTopic(String(topic), options.filter);
    // Subscribes to a topic and passes the listener to the Sockets Service.
    await this._socketsService.topic(
      parsedTopic,
      listener,
    );
    // Storing the subscription in the internal subscription map.
    const subscriptionId = generateSubscriptionUUID();
    this._subscriptions.set(subscriptionId, [parsedTopic, listener]);
    return subscriptionId;
  }

  public async unsubscribe(subscriptionId: string): Promise<void> {
    const [topic, listener] = this._subscriptions.get(subscriptionId) ?? [];
    if (topic && listener) {
      this._socketsService._socket.removeListener(topic, listener);
      this._subscriptions.delete(subscriptionId);
    }
  }
}
