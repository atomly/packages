// Types
import { IStorageServiceStoreOptions } from '../../storages';

export interface IDefaultPublisherServiceArgs {
  /**
   * Default Storage Service expiracy time of stored key/value pairs.
   */
  defaultExpiracyTime: IStorageServiceStoreOptions['expiracyTime']
  /**
   * Default expiracy mode.
   */
  defaultExpiryMode: IStorageServiceStoreOptions['expiryMode']
}
