// Test Utils
import { setupHubfulInstance, wait } from '../utils';

// Dependencies
import Hubful, { usePublish, TStorageServicePayload } from '../../src';

const WAIT_TIMER = 50;
const TOPIC = 'bar';
const PAYLOAD = { foo: 'baz' };

describe('correctly publishes a value using the usePublish hook', () => {

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

  it('correctly publishes a value', async () => {
    const mockFunction = jest.fn(async (topic: string, payload: TStorageServicePayload) => {
      console.log(`DEBUG topic: `, topic);
      console.log(`DEBUG payload: `, payload);
      expect(topic).toBe(TOPIC);
      expect(payload).toMatchObject(PAYLOAD);
    });
    await Hubful.subscribe(TOPIC, mockFunction);
    await expect(usePublish(TOPIC, PAYLOAD)).resolves.not.toThrow();
    await wait(WAIT_TIMER);
    expect(mockFunction.mock.calls).toHaveLength(1);
  }, 10000);
});
