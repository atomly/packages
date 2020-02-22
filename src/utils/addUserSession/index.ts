// Libraries
import { Redis } from 'ioredis';

// Dependencies
import { userSessionIdPrefix } from '@root/constants';

export async function addUserSession(redis: Redis, userId: number, sessionID: string): Promise<number> {
  return redis.lpush(`${userSessionIdPrefix}${userId}`, sessionID);
}
