// Libraries
import faker from 'faker';

// Types
import { TEventHandler } from '../../../src';

// Dependencies
import { getDefaultSubscriberService, getDefaultPublisherService, getRandomInt, wait } from '../../utils';

const defaultSubscriberService = getDefaultSubscriberService();
const defaultPublisherService = getDefaultPublisherService();

// Constants
const WAIT_TIMER = 50;
const AMOUNT_PUBLICATIONS = 1000;
const AMOUNT_UNIQUE_TOPICS = 2500;
const UNIQUE_TOPICS = new Array(AMOUNT_UNIQUE_TOPICS)
  .fill(undefined)
  .map(() => faker.random.uuid());

// Top-level subscriber results for assertions:
let receivedPayloadsPerTopic: Record<string, string[]>;

/**
 * Helper function to reset the `receivedPayloadsPerTopic` variable
 * before each test.
 */
function getReceivedPayloadsPerTopic(): Record<string, string[]> {
  return UNIQUE_TOPICS.reduce<Record<string, string[]>>((acc, topic) => {
    acc[topic] = [];
    return acc;
  }, {});
}

describe('correctly subscribes to multiple topics', () => {
  async function onTopicHandler(topic: string, payload: string): Promise<void> {
    expect(UNIQUE_TOPICS).toContain(topic);
    receivedPayloadsPerTopic[topic].push(payload);
    if (AMOUNT_PUBLICATIONS <= 5) {
      console.log('[onTopicHandler] topic: ', topic);
      console.log('[onTopicHandler] payload: ', payload);
      console.log('[onTopicHandler] receivedPayloadsPerTopic[topic]: ', receivedPayloadsPerTopic[topic]);
      console.log('[onTopicHandler] receivedPayloadsPerTopic: ', receivedPayloadsPerTopic);
    }
    expect(topic).toBeTruthy();
    expect(payload).toBeTruthy();
  }

  beforeAll(
    async () => {
      await Promise.all([
        defaultSubscriberService._eventsService.start(),
        defaultSubscriberService._storageService.connect(),
        defaultPublisherService._eventsService.start(),
        defaultPublisherService._storageService.connect(),
      ]);
    },
    120000,
  );

  afterAll(
    async () => {
      await Promise.all([
        defaultSubscriberService._eventsService.close(),
        defaultSubscriberService._storageService.disconnect(),
        defaultPublisherService._eventsService.close(),
        defaultPublisherService._storageService.disconnect(),
      ]);
    },
    120000,
  );

  // Before each test, reset the receivedPayloadsPerTopic.
  beforeEach(() => {
    receivedPayloadsPerTopic = getReceivedPayloadsPerTopic();
  })

  it(`correctly subscribes to all ${UNIQUE_TOPICS.length} unique topics`, async () => {
    expect(UNIQUE_TOPICS.length).toBeTruthy();
    await expect(Promise.all(
      UNIQUE_TOPICS.map(topic => defaultSubscriberService.subscribe(topic, onTopicHandler)),
    )).resolves.not.toThrow();
    expect(defaultSubscriberService._eventsService._handlersMap.size).toBe(AMOUNT_UNIQUE_TOPICS);
  }, 10000);

  it(`correctly publishes exactly 1 payload to each ${UNIQUE_TOPICS.length} unique topics`, async() => {
    for (let i = 0; i < AMOUNT_PUBLICATIONS; i += 1) {
      const index = getRandomInt(0, AMOUNT_UNIQUE_TOPICS - 1);
      const randomTopic = UNIQUE_TOPICS[index];
      await defaultPublisherService.publish(randomTopic, faker.random.words());
    }
    await wait(WAIT_TIMER);
    // Expect the received payloads to be 1 payload p er topic:
    const receivedPayloadsPerTopicList = Object.keys(receivedPayloadsPerTopic);
    console.log('receivedPayloadsPerTopicList.length: ', receivedPayloadsPerTopicList.length);
    expect(receivedPayloadsPerTopicList).toHaveLength(UNIQUE_TOPICS.length);
  });

  it(`correctly randomly publishes ${AMOUNT_PUBLICATIONS} payloads to random topics`, async() => {
    for (let i = 0; i < AMOUNT_PUBLICATIONS; i += 1) {
      const index = getRandomInt(0, AMOUNT_UNIQUE_TOPICS - 1);
      const randomTopic = UNIQUE_TOPICS[index];
      await defaultPublisherService.publish(randomTopic, faker.random.words());
    }
    await wait(WAIT_TIMER);
    // Expect the received payloads to be a total AMOUNT_PUBLICATIONS spread
    // across all unique topic:
    const receivedPayloadsAmount = Object
      .values(receivedPayloadsPerTopic)
      .reduce<number>((acc, value = []) => {
        return acc + value.length;
      }, 0);
    console.log('receivedPayloadsAmount: ', receivedPayloadsAmount);
    expect(receivedPayloadsAmount).toBe(AMOUNT_PUBLICATIONS);
  });

  const topic = UNIQUE_TOPICS[0];
  let subscriptionId: string;

  it('correctly subscribes a new handler on existing subscribed topics', async () => {
    // Originally it has 1 handler, but it should now subscribe a new one to give a
    // total of 2.
    const topic = UNIQUE_TOPICS[0];
    subscriptionId = await defaultSubscriberService.subscribe(topic, onTopicHandler);
    const topicHandlers = defaultSubscriberService._eventsService._eventsMap.get(topic);
    expect(topicHandlers).toHaveLength(2);
  });

  it('correctly unsubscribes a handler from a specific topic using its subscription ID', async () => {
    await defaultSubscriberService.unsubscribe(subscriptionId);
    const topicHandlers = defaultSubscriberService._eventsService._eventsMap.get(topic);
    expect(topicHandlers).toHaveLength(1);
  });

  it('correctly unsubscribes ALL handlers from a specific topic', async () => {
    // First subscribe two more handlers:
    let topicHandlers: TEventHandler[] | undefined;
    await defaultSubscriberService.subscribe(topic, onTopicHandler); // 2
    await defaultSubscriberService.subscribe(topic, onTopicHandler); // 3
    topicHandlers = defaultSubscriberService._eventsService._eventsMap.get(topic);
    expect(topicHandlers).toHaveLength(3);
    // Now unsubscribe all handlers from this topic:
    await defaultSubscriberService.unsubscribeAll(topic);
    topicHandlers = defaultSubscriberService._eventsService._eventsMap.get(topic);
    expect(topicHandlers).toBeUndefined();
    // The other [AMOUNT_UNIQUE_TOPICS - 1] topics should still be subscribed:
    expect(defaultSubscriberService._eventsService._handlersMap.size).toBe(AMOUNT_UNIQUE_TOPICS - 1);
  });

  it('correctly unsubscribes ALL handlers of ALL topics', async () => {
    await defaultSubscriberService.unsubscribeAll();
    expect(defaultSubscriberService._eventsService._eventsMap.size).toBe(0);
    expect(defaultSubscriberService._eventsService._handlersMap.size).toBe(0);
  });
});
