// Libraries
import { Redis } from 'ioredis';

// Types
import { IStorageService } from '../StorageService';

export interface IIORedisStorageServiceArgs {
  /**
   * Redis Cluster Nodes configuration.
   * [Documentation](https://redis.io/commands/cluster-nodes).
   */
  nodes: { host: string, port: number } | Array<{ host: string, port: number }>
  /**
   * Redis connection name.
   */
  name: string
  /**
   * Redis connection family, 4 (IPv4) or 6 (IPv6).
   */
  family: 4 | 6
  /**
   * Redis connection password.
   */
  password: string
  /**
   * Redis client DB number.
   */
  db: number
}

export interface IIORedisStorageService extends IStorageService {
  /**
   * Internal instance of the Redis client.
   */
  _redis: Redis
}
