// Test Utils
import { setupHubfulInstance, wait } from '../utils';

// Dependencies
import Hubful, { useUnsubscribe } from '../../src';

const WAIT_TIMER = 50;
const TOPIC = 'bar';
const PAYLOAD = { foo: 'baz' };

describe('correctly unsubscribes from a topic using the useUnsubscribe hook', () => {
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

  let subscriptionId: string;
  const mockFunction = jest.fn();

  it('correctly subscribes to a topic', async () => {
    subscriptionId = await Hubful.subscribe(TOPIC, mockFunction);
    await Hubful.publish(TOPIC, PAYLOAD);
    await wait(WAIT_TIMER);
    expect(mockFunction.mock.calls).toHaveLength(1);
  }, 10000);

  it('correctly unsubscribes from a topic', async () => {
    await expect(useUnsubscribe(subscriptionId)).resolves.not.toThrow();
    await Hubful.publish(TOPIC, PAYLOAD);
    await wait(WAIT_TIMER);
    expect(mockFunction.mock.calls).toHaveLength(1);
  }, 10000);
});
