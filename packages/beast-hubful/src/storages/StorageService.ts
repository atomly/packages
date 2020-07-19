export type KeyType = string | Buffer;

export type ValueType = string | Buffer | number | unknown[];

export enum ESetExpiracyModes {
  /**
   * Seconds - Set the specified expire time, in seconds.
   */
  EX = 'EX',
  /**
   * Milliseconds - Set the specified expire time, in milliseconds.
   */
  PX = 'PX',
  /**
   * Only set the key if it does not already exist.
   */
  NX = 'NX',
  /**
   * Only set the key if it already exist.
   */
  XX = 'XX',
  /**
   * Retain the time to live associated with the key.
   */
  KEEPTTL = 'KEEPTTL',
}

export interface IStorageServiceStoreOptions {
  /**
   * Storage Service expiracy time of stored key/value pairs.
   */
  expiracyTime?: number | string
  /**
   * Expiracy modes.
   */
  expiryMode?: ESetExpiracyModes
}

export interface IStorageService {
  /**
   * Connects to the Storage Service client.
   */
  connect(): Promise<void>
  /**
   * Disconnects from the Storage Service client.
   */
  disconnect(): Promise<void>
  /**
   * Store key to hold the string value. If key already holds a value, it
   * is overwritten, regardless of its type. Any previous time to live
   * associated with the key is discarded/overwritten on successful store operation.
   * @param key - Key string.
   * @param value - Value string.
   * @param options - Optional store options to enable auto-expiracy.
   */
  store(key: KeyType, value: ValueType, options?: IStorageServiceStoreOptions): Promise<ValueType>
}
