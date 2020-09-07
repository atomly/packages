// Dependencies
import { DefaultPublisherService } from '../../../src';
import { getIORedisStorageService } from './getIORedisStorageService';
import { getIORedisEventsService } from './getIORedisEventsService';

export function getDefaultPublisherService(): DefaultPublisherService {
  return new DefaultPublisherService({
    storageService: getIORedisStorageService(),
    eventsService: getIORedisEventsService(),
  });
}
