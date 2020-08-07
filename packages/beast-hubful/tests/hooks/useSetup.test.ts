// Test Utils
import { getIORedisEventsService, getIORedisStorageService } from '../utils';

// Dependencies
import Hubful, { useSetup, DefaultPublisherService, DefaultSubscriberService } from '../../src';

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

describe('correctly sets up the Hubful dependencies using the useSetup hook', () => {
  it('correctly sets up the Hubful dependencies', async () => {
    expect(Hubful.eventsService).toBeFalsy();
    expect(Hubful.storageService).toBeFalsy();
    expect(Hubful.publisherService).toBeFalsy();
    expect(Hubful.subscriberService).toBeFalsy();
    await expect(useSetup({
      eventsService: ioRedisEventsService,
      storageService: ioRedisStorageService,
      publisherService: defaultPublisherService,
      subscriberService: defaultSubscriberService,
    })).resolves.not.toThrow();
    expect(Hubful.eventsService).toBeTruthy();
    expect(Hubful.storageService).toBeTruthy();
    expect(Hubful.publisherService).toBeTruthy();
    expect(Hubful.subscriberService).toBeTruthy();
  }, 10000);
});
