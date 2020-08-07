// Test Utils
import faker from 'faker';
import { setupHubfulInstance } from '../utils';
import { isAsyncIterable } from 'iterall';

// Dependencies
import Hubful, { useHubfulAsyncIterator } from '../../src';

describe('correctly digests payloads sent to a topic using the useHubfulIterator hook', () => {
  // Setting up Hubful:
  beforeAll(
    async () => {
      await setupHubfulInstance();
    },
    120000,
  );

  afterAll(
    async () => {
      await Hubful.shutdown();
    },
    120000,
  );

  it('correctly instantiates the asyncIterator', () => {
    const topic = faker.random.words();
    const hubfulAsyncIterator = useHubfulAsyncIterator(topic);
    expect(isAsyncIterable(hubfulAsyncIterator)).toBe(true);
  });

  it('should trigger asyncIterator when publishing payloads', async () => {
    const topic = faker.random.uuid();
    const value = { value: faker.random.words() };
    const result = await new Promise<IteratorResult<unknown>>((resolve, reject) => {
      const hubfulAsyncIterator = useHubfulAsyncIterator(topic);
      hubfulAsyncIterator.next()
        .then(resolve)
        .catch(reject);
      Hubful.publish(topic, value);
    });
    expect(result.done).not.toBeNull();
    expect(result.value).not.toBeNull();
    expect(result.value).toMatchObject(value);
  });
});
