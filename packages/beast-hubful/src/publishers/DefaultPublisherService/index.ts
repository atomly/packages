// Dependencies
import { generateTopicUUID, parseTopic } from '../../utils/index';

// Types
import { KeyType, ValueType } from '../../storages';
import { ESetExpiracyModes } from '../../storages';
import { IPublisherServicePublishOptions } from '../PublisherService';
import { IDefaultPublisherService } from './types';

export class DefaultPublisherService implements IDefaultPublisherService {
  public _socketsService: IDefaultPublisherService['_socketsService'];
  public _storageService: IDefaultPublisherService['_storageService'];
  public _params: IDefaultPublisherService['_params'];

  constructor(
    args: {
        _socketsService: IDefaultPublisherService['_socketsService']
        _storageService: IDefaultPublisherService['_storageService']
    },
    params: IDefaultPublisherService['_params'],
  ) {
    this._socketsService = args._socketsService;
    this._storageService = args._storageService;
    this._params = {
      defaultExpiracyTime: params.defaultExpiracyTime ?? '3600', // 1 hour of expiracy time
      defaultExpiryMode: params.defaultExpiryMode ?? ESetExpiracyModes.EX,
    };
  }

  public async publish(topic: KeyType, payload: ValueType, options: IPublisherServicePublishOptions = {}): Promise<void> {
    const topicId = generateTopicUUID(String(topic), options.filter);
    // Storing the published message.
    const processedPayload = this.processPayload(payload);
    await this._storageService.store(
      topicId,
      processedPayload,
      {
        expiracyTime: options.expiracyTime ?? this._params.defaultExpiracyTime,
        expiryMode: options.expiryMode ?? this._params.defaultExpiryMode,
      },
    );
    // Publishing event AFTER the payload has been stored.
    const parsedTopic = parseTopic(String(topic), options.filter);
    await this._socketsService.emit(
      parsedTopic,
      topicId,
    );
  }

  /**
   * Processes a published payload.
   * @param payload - Payload sent to the clients.
   */
  private processPayload(payload: unknown): ValueType {
    if (typeof payload === 'string') {
      return payload;
    } else if (typeof payload === 'number') {
      return payload;
    } else if (Array.isArray(payload)) {
      return payload;
    } else if (payload instanceof Buffer) {
      return payload;
    } else {
      return JSON.stringify(payload);
    }
  }
}
