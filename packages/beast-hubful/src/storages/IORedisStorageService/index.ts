// Libraries
import IORedis, { Redis } from 'ioredis';
import { v4 } from 'uuid';

// Types
import { IStorageServiceStoreOptions, TStorageServicePayload, IStorageServiceValue, EStorageServiceValueType } from '../StorageService';
import { IIORedisStorageService, IIORedisStorageServiceArgs } from './types';

export class IORedisStorageService implements IIORedisStorageService {
  public _redis: Redis;

  constructor(args: IIORedisStorageServiceArgs) {
    // Setting up Redis client:
    if (Array.isArray(args.nodes)) {
      this._redis = new IORedis({
        sentinels: args.nodes,
        // name: args.name,
        family: args.family,
        password: args.password,
        db: args.db,
      });
    } else  {
      this._redis = new IORedis({
        port: args.nodes.port,
        host: args.nodes.host,
        // name: args.name,
        family: args.family, // 4 (IPv4) or 6 (IPv6)
        password: args.password,
        db: args.db,
      });
    }
  }

  public async connect(): Promise<void> {
    if (
      this._redis.status !== 'connecting' &&
      this._redis.status !== 'connected' &&
      this._redis.status !== "ready"
    ) {
      await this._redis.connect();
    }
  }

  public async disconnect(): Promise<void> {
    await this._redis.quit();
  }

  public async store(payload: TStorageServicePayload, options?: IStorageServiceStoreOptions): Promise<string> {
    const id = v4();
    const value = JSON.stringify(this._processPayload(payload));
    if (options) {
      await this._redis.set(id, value, options.expiryMode, options.expiracyTime);
    } else {
      await this._redis.set(id, value);
    }
    return id;
  }

  // TODO: Refactor to somehow support TypeScript generics.
  public async get(key: string): Promise<TStorageServicePayload | null> {
    const storedValue = await this._redis.get(key);
    if (storedValue) {
      const value = JSON.parse(storedValue) as IStorageServiceValue;
      switch(value.type) {
        case EStorageServiceValueType.UNKNOWN:
          return JSON.parse(value.payload as string).payload;
        case EStorageServiceValueType.BUFFER:
          return Buffer.from(value.payload as string[]);
        default:
          return value.payload;
      }
    } else {
      return null;
    }
  }

  public _processPayload(payload: TStorageServicePayload): IStorageServiceValue {
    switch(true) {
      case typeof payload === 'string':
        return { type: EStorageServiceValueType.STRING, payload };
      case typeof payload === 'boolean':
        return { type: EStorageServiceValueType.BOOLEAN, payload };
      case typeof payload === 'number':
        return { type: EStorageServiceValueType.NUMBER, payload };
      case Array.isArray(payload):
        return { type: EStorageServiceValueType.ARRAY, payload };
      case payload instanceof Buffer:
        return { type: EStorageServiceValueType.BUFFER, payload };
      default:
        return { type: EStorageServiceValueType.UNKNOWN, payload: JSON.stringify({ payload }) };
    }
  }
}
