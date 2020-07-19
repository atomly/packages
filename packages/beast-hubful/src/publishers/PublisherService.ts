import { ISocketsService } from '../sockets';
import { IStorageService, IStorageServiceStoreOptions } from '../storages';

export interface IPublisherServicePublishOptions extends IStorageServiceStoreOptions {
  /**
   * Filters topics by a string identifier.
   */
  filter?: string
}

export interface IPublisherService {
  /**
   * Hubful generic SocketsService.
   */
  _socketsService: ISocketsService
  /**
   * Hubful generic StorageService.
   */
  _storageService: IStorageService
  /**
   * Publishes a payload to clients subscribed to the topic.
   * @param topic - Topic identifier string.
   * @param payload - Payload sent to the clients.
   * @param options - Options to filter the topic, or set expiracy on the payload.
   */
  publish(topic: string, payload: unknown, options?: IPublisherServicePublishOptions): Promise<void>
}
