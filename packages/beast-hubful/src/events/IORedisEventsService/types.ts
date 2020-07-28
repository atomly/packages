// Libraries
import { Redis } from 'ioredis';

// Types
import { IEventsService } from '../EventsService';

export interface IIORedisEventsServiceArgs {
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

export interface IIORedisEventsService extends IEventsService {
  /**
   * Internal instance of the io-redis subscriber client.
   */
  _ioSubscriberRedis: Redis
  /**
   * Internal instance of the io-redis publisher client.
   */
  _ioPublisherRedis: Redis
}
