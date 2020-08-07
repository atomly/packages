// Test Utils
import { setupHubfulInstance, wait } from '../utils';

// Dependencies
import Hubful, { TStorageServicePayload, useSubscribe } from '../../src';

const WAIT_TIMER = 50;
const TOPIC = 'bar';
const PAYLOAD = { foo: 'baz' };

describe('correctly subscribes to a topic using the useSubscribe hook', () => {
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

  it('correctly subscribes to a topic', async () => {
    const mockFunction = jest.fn(async (topic: string, payload: TStorageServicePayload) => {
      console.log(`DEBUG topic: `, topic);
      console.log(`DEBUG payload: `, payload);
      expect(topic).toBe(TOPIC);
      expect(payload).toMatchObject(PAYLOAD);
    });
    await expect(useSubscribe(TOPIC, mockFunction)).resolves.not.toThrow();
    await Hubful.publish(TOPIC, PAYLOAD);
    await wait(WAIT_TIMER);
    expect(mockFunction.mock.calls).toHaveLength(1);
  }, 10000);
});
