// Libraries
import faker from 'faker';

// Dependencies
import { getIORedisEventsService, wait } from '../../utils';

const WAIT_TIMER = 50; // Wait timer to wait for the event emitters and handlers.
const TOPIC_1 = 'TOPIC_1';
const TOPIC_2 = 'TOPIC_2';
const PAYLOAD = { foo: faker.random.words() };
const ioRedisEventsService = getIORedisEventsService();

/**
 * Emit utility function to give a bit of padding for the event handlers
 * to process the topic & payloads.
 */
async function emit(): Promise<void> {
  await wait(WAIT_TIMER);
  await expect(Promise.all([
    ioRedisEventsService.emit(TOPIC_1, JSON.stringify(PAYLOAD)),
    ioRedisEventsService.emit(TOPIC_2, JSON.stringify(PAYLOAD)),
  ])).resolves.not.toThrow();
  await wait(WAIT_TIMER);
}

describe('IORedisEventsService works correctly', () => {
  afterAll(
    async () => {
      try {
        await ioRedisEventsService.close();
      } catch (err) {
        console.log('Connection was already closed');
      }
    },
    10000,
  );

  describe('PubSub workflow works correctly', () => {
    const subscriptionsPerTopic: Record<string, string[]> = { [TOPIC_1]: [], [TOPIC_2]: [] };
    const callsPerTopic: Record<string, number> = { [TOPIC_1]: 0, [TOPIC_2]: 0 };

    function onTopicHandler(topic: string, payload: string): void {
      callsPerTopic[topic] += 1;
      expect(JSON.parse(payload)).toEqual(PAYLOAD);
      expect(subscriptionsPerTopic[topic].length).toBeTruthy();
      // console.log(`[${topic}] topic: `, topic);
      // console.log(`[${topic}] payload: `, payload);
      // console.log(`[${topic}] callsPerTopic: `, callsPerTopic);
    }

    it('correctly starts and subscribes to different topics', async () => {
      expect(async () => {
        const subscriptionIds = await Promise.all([
          ioRedisEventsService.on(TOPIC_1, onTopicHandler),
          ioRedisEventsService.on(TOPIC_1, onTopicHandler),
          ioRedisEventsService.on(TOPIC_2, (...args) => onTopicHandler(...args)),
          ioRedisEventsService.start(),
        ]);
        subscriptionsPerTopic[TOPIC_1].push(subscriptionIds[0]);
        subscriptionsPerTopic[TOPIC_1].push(subscriptionIds[1]);
        subscriptionsPerTopic[TOPIC_2].push(subscriptionIds[2]);
      }).not.toThrow();
    }, 10000);

    it('correctly emits, receives, and processes payloads on different topics', async () => {
      await emit();
      expect(callsPerTopic[TOPIC_1]).toBe(2); // TOPIC_1 has two handlers so the count increases by 2
      expect(callsPerTopic[TOPIC_2]).toBe(1); // TOPIC_2 has two handlers so the count increases by 1
    }, 10000);

    it(`correctly unsubscribes from topic [${TOPIC_1}]`, async () => {
      expect(async () => {
        // Should return false since the ID is fake.
        const isRemoved: boolean = await ioRedisEventsService.remove(faker.random.words());
        expect(isRemoved).toBe(false);
        // Should remove the subscribed TOPIC_1 handlers:
        const wereRemoved: boolean[] = [];
        for (const subscriptionId of subscriptionsPerTopic[TOPIC_1]) {
          const isRemoved = await ioRedisEventsService.remove(subscriptionId);
          wereRemoved.push(isRemoved);
        }
        // All handlers should have been removed.
        wereRemoved.forEach(value => expect(value).toBe(true));
        // And handlers Array should be deleted.
        expect(ioRedisEventsService._eventsMap.get(TOPIC_1)).toBeFalsy();
        subscriptionsPerTopic[TOPIC_1] = [];
      }).not.toThrow();
    }, 10000);

    it(`correctly emits, receives, and processes payloads on different topics after unsubscribing from [${TOPIC_1}]`, async () => {
      await emit();
      console.log('[correctly emits payloads on different to] callsPerTopic: ', callsPerTopic);
      expect(callsPerTopic[TOPIC_1]).toBe(2); // TOPIC_1 should not change since we unsubscribed from it
      expect(callsPerTopic[TOPIC_2]).toBe(2); // TOPIC_2 should change since we are still subscribed
    }, 10000);

    it(`correctly removes all the registered events`, async () => {
      // Correctly removes specific events:
      const topic = faker.random.words();
      await ioRedisEventsService.on(topic, () => {});
      await expect(ioRedisEventsService.removeAll(topic)).resolves.not.toThrow();
      expect(ioRedisEventsService._eventsMap.get(topic)).toBeFalsy();
      ioRedisEventsService._handlersMap.forEach(handlerData => {
        expect(handlerData.event).not.toBe(topic);
      });
      // Correctly removes all events:
      await Promise.all(new Array(10).fill(undefined).map(() => (
        ioRedisEventsService.on(faker.random.word(), () => {})
      )));
      await expect(ioRedisEventsService.removeAll()).resolves.not.toThrow();
      expect(ioRedisEventsService._eventsMap.size).toBeFalsy();
      expect(ioRedisEventsService._handlersMap.size).toBeFalsy();
    }, 10000);

    it(`correctly closes the events service`, async () => {
      await expect(ioRedisEventsService.close()).resolves.not.toThrow();
    }, 10000);

    it(`emits payloads & does not processes the payloads after closing the service`, async () => {
      await expect(emit).rejects.toThrow(); // Should throw an error since the connection is closed.
      expect(callsPerTopic[TOPIC_1]).toBe(2); // TOPIC_1 should not change values because events service is closed
      expect(callsPerTopic[TOPIC_2]).toBe(2); // TOPIC_2 should not change values because events service is closed
    }, 10000);

    // TODO: pattern events
    // TODO: test error `Handler for event [${event}] not found.`
  });
});
