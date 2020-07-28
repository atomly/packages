// Dependencies
import { IORedisEventsService } from '../../../src';

export function getIORedisEventsService(): IORedisEventsService {
  return new IORedisEventsService({
    nodes: {
      port: 6378,
      host: 'localhost',
    },
    name: 'beast_docker_hubful_redis',
    family: 4,
    password: 'password',
    db: 0,
  });
}
