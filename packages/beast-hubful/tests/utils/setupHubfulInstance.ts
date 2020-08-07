// Dependencies
import Hubful, { DefaultSubscriberService, DefaultPublisherService } from '../../src';
import {
  getIORedisEventsService,
  getIORedisStorageService,
} from './instances';

const ioRedisEventsService = getIORedisEventsService();

const ioRedisStorageService = getIORedisStorageService();

const defaultPublisherService = new DefaultPublisherService({
  eventsService: ioRedisEventsService,
  storageService: ioRedisStorageService,
});

const defaultSubscriberService = new DefaultSubscriberService({
  eventsService: ioRedisEventsService,
  storageService: ioRedisStorageService,
});

export async function setupHubfulInstance(): Promise<void> {
  await Hubful.setup({
    eventsService: ioRedisEventsService,
    storageService: ioRedisStorageService,
    publisherService: defaultPublisherService,
    subscriberService: defaultSubscriberService,
  });
}
