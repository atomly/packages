// Dependencies
import Hubful, { DefaultSubscriberService, DefaultPublisherService } from '../../src';
import {
  getIORedisEventsService,
  getIORedisStorageService,
} from './instances';

const socketIOEventsService = getIORedisEventsService();

const ioRedisStorageService = getIORedisStorageService();

const publisherService = new DefaultPublisherService({
  eventsService: socketIOEventsService,
  storageService: ioRedisStorageService,
});

const subscriberService = new DefaultSubscriberService({
  eventsService: socketIOEventsService,
  storageService: ioRedisStorageService,
});

export async function setupHubfulInstance(): Promise<void> {
  await Hubful.setup({
    eventsService: socketIOEventsService,
    storageService: ioRedisStorageService,
    publisherService,
    subscriberService,
  });
}
