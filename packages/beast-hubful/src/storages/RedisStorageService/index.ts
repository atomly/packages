// Libraries
import IORedis, { Redis, KeyType, ValueType } from 'ioredis';

// Types
import { IStorageServiceStoreOptions } from '../StorageService';
import { IRedisStorageService, IRedisStorageServiceParams } from './types';

export class RedisStorageService implements IRedisStorageService {
  public _redis: Redis;
  public _params: IRedisStorageServiceParams;

  constructor(params: IRedisStorageServiceParams) {
    // Setting up Redis client:
    if (Array.isArray(params.nodes)) {
      this._redis = new IORedis({
        sentinels: params.nodes,
        name: params.name,
        family: params.family,
        password: params.password,
        db: params.db,
      });
    } else  {
      this._redis = new IORedis({
        port: params.nodes.port,
        host: params.nodes.host,
        name: params.name,
        family: params.family, // 4 (IPv4) or 6 (IPv6)
        password: params.password,
        db: params.db,
      });
    }
    // Storing up parameters:
    this._params = params;
  }

  public async connect(): Promise<void> {
    await this._redis.connect();
  }

  public async disconnect(): Promise<void> {
    await this._redis.quit();
  }

  public async store(key: KeyType, value: ValueType, options?: IStorageServiceStoreOptions): Promise<ValueType> {
    if (options) {
      await this._redis.set(key, value, options.expiryMode, options.expiracyTime);
    } else {
      await this._redis.set(key, value);
    }
    return value;
  }
}
