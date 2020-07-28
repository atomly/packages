export enum EStorageServiceValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  BUFFER = 'buffer',
  UNKNOWN = 'unknown',
}

export type TStorageServicePayload = string | Buffer | number | unknown[] | boolean | Record<string, unknown>;

export interface IStorageServiceValue {
  type: EStorageServiceValueType
  payload: TStorageServicePayload
}

export enum EStorageServiceSetExpiracyModes {
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
   * Storage Service expiracy time of stored key/payload pairs.
   */
  expiracyTime?: number | string
  /**
   * Expiracy modes.
   */
  expiryMode?: EStorageServiceSetExpiracyModes
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
   * Store key to hold the string payload. If key already holds a payload, it
   * is overwritten, regardless of its type. Any previous time to live
   * associated with the key is discarded/overwritten on successful store operation.
   * @param payload - Payload string.
   * @param options - Optional store options to enable auto-expiracy.
   * @returns {string} Returns the generated key for the stored payload.
   */
  store(payload: TStorageServicePayload, options?: IStorageServiceStoreOptions): Promise<string>
  /**
   * Retrieves a payload from the store from a given key. Returns null if it does not
   * exists.
   * @param key - Key string.
   */
  get(key: string): Promise<TStorageServicePayload | null>
  /**
   * Processes a value.
   * @param value - Value stored.
   */
  _processPayload(payload: TStorageServicePayload): IStorageServiceValue
}
