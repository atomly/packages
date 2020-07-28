// Dependencies
import { DefaultSubscriberService } from '../../../src';
import { getIORedisStorageService } from './getIORedisStorageService';
import { getIORedisEventsService } from './getIORedisEventsService';

export function getDefaultSubscriberService(): DefaultSubscriberService {
  return new DefaultSubscriberService({
    storageService: getIORedisStorageService(),
    eventsService: getIORedisEventsService(),
  });
}
