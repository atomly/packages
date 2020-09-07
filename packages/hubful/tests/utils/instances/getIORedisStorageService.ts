// Dependencies
import { IORedisStorageService } from '../../../src';

export function getIORedisStorageService(): IORedisStorageService {
  return new IORedisStorageService({
    nodes: {
      port: 6378,
      host: 'localhost',
    },
    name: 'atomly_docker_hubful_redis',
    family: 4,
    password: 'password',
    db: 0,
  });
}
