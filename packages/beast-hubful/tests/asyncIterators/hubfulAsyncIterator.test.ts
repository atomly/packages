// Libraries
import faker from 'faker';
import { isAsyncIterable } from 'iterall';

// Dependencies
import Hubful, { HubfulAsyncIterator, EHubfulServiceStatus } from '../../src';

// Utils
import { setupHubfulInstance, wait } from '../utils';

const WAIT_TIMER = 50;

describe('correctly publishes payloads', () => {
  beforeAll(
    async () => {
      await setupHubfulInstance();
    },
    120000,
  );

  afterAll(
    async () => {
      if (Hubful.status === EHubfulServiceStatus.CONNECTED) {
        await Hubful.shutdown();
      }
    },
    120000,
  );

  it('correctly instantiates the asyncIterator', () => {
    const topic = faker.random.words();
    const hubfulAsyncIterator = new HubfulAsyncIterator({
      hubful: Hubful,
      topics: topic,
    });
    expect(isAsyncIterable(hubfulAsyncIterator)).toBe(true);
  });

  it('should trigger asyncIterator when publishing payloads', async () => {
    const topic = faker.random.uuid();
    const value = { value: faker.random.words() };
    const result = await new Promise<IteratorResult<unknown>>((resolve, reject) => {
      const hubfulAsyncIterator = new HubfulAsyncIterator({
        hubful: Hubful,
        topics: topic,
      });
      hubfulAsyncIterator.next()
        .then(resolve)
        .catch(reject);
      Hubful.publish(topic, value);
    });
    expect(result.done).not.toBeNull();
    expect(result.value).not.toBeNull();
    expect(result.value).toMatchObject(value);
  });

  it('should not trigger asyncIterator when publishing on other topics', async () => {
    const topic1 = faker.random.words();
    const topic2 = faker.random.word();
    const hubfulAsyncIterator = new HubfulAsyncIterator({
      hubful: Hubful,
      topics: topic2,
    });
    const mockFunction = jest.fn(() => undefined);
    hubfulAsyncIterator.next().then(mockFunction);
    // Should not receive
    await Hubful.publish(topic1, { test: true });
    await wait(WAIT_TIMER);
    expect(mockFunction.mock.calls).toHaveLength(0);
    // Make sure that it does receives something:
    await Hubful.publish(topic2, { test: true });
    await wait(WAIT_TIMER);
    expect(mockFunction.mock.calls).toHaveLength(1);
  });

  it('correctly registers to multiple topics', async () => {
    const topics = [faker.random.words(), faker.random.word()];
    const hubfulAsyncIterator = new HubfulAsyncIterator({
      hubful: Hubful,
      topics,
    });
    const mockFunction = jest.fn(() => undefined);
    const result: IteratorResult<unknown> = await new Promise(resolve => {
      hubfulAsyncIterator.next().then((res) => {
        mockFunction();
        resolve(res);
      });
      Hubful.publish(topics[0], { test: true });
    })
    expect(result.value).toMatchObject({ test: true });
    expect(mockFunction.mock.calls).toHaveLength(1);
  });

  
  it('should not trigger asyncIterator when already returned', async () => {
    const topic = faker.random.words();
    const hubfulAsyncIterator = new HubfulAsyncIterator({
      hubful: Hubful,
      topics: topic,
    });
    const payload = { test: faker.random.word() };

    // eslint-disable-next-line jest/valid-expect-in-promise
    hubfulAsyncIterator.next().then(result => { // first result (value should be payload)
      expect(result).toBeTruthy();
      expect(result.value).toBeTruthy();
      expect(result.value).toMatchObject(payload);
      expect(result.done).toBe(false);
    });

    await Hubful.publish(topic, payload);
    await wait(WAIT_TIMER);

    // eslint-disable-next-line jest/valid-expect-in-promise
    hubfulAsyncIterator.next().then(result => { // second result (value should be undefined)
      expect(result).toBeTruthy();
      expect(result.value).toBeUndefined();
      expect(result.done).toBe(true);
    });

    await hubfulAsyncIterator.return();
    await Hubful.publish(topic, payload);
    await wait(WAIT_TIMER);
  });
});
