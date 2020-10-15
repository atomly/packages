// Libraries
import faker from 'faker';

// Dependencies
import Hubful, { EHubfulServiceStatus } from '../../../src';

// Utils
import { setupHubfulInstance, getRandomInt } from '../../utils';

const TOPIC = faker.random.words();
const UNIT_TESTS_COUNT = 100;
const RANDOM_VALUE_GETTERS = [
  faker.random.alphaNumeric,
  faker.random.arrayElement,
  faker.random.boolean,
  faker.random.image,
  faker.random.locale,
  faker.random.number,
  faker.random.objectElement,
  faker.random.uuid,
  faker.random.word,
  faker.random.words,
];

const randomValues = new Array(UNIT_TESTS_COUNT)
  .fill(undefined)
  .map(() => RANDOM_VALUE_GETTERS[getRandomInt(0, RANDOM_VALUE_GETTERS.length - 1)]())

describe('correctly publishes payloads', () => {
  async function onTopicHandler(topic: string, payload: { value: string | number | boolean,  index: number }): Promise<void> {
    expect(topic).toBe(TOPIC);
    expect(payload).toBeTruthy();
    if (UNIT_TESTS_COUNT <= 5) {
      console.log('[onTopicHandler] topic: ', topic);
      console.log('[onTopicHandler] payload: ', payload);
      console.log('[onTopicHandler] randomValues[payload.index]: ', randomValues[payload!.index]);
      console.log('[onTopicHandler] payload.value === randomValues[payload.index]: ', payload!.value === randomValues[payload!.index]);
    }
    expect(payload.value).toBe(randomValues[payload.index]);
  }

  afterAll(
    async () => {
      if (Hubful.status === EHubfulServiceStatus.CONNECTED) {
        await Hubful.shutdown();
      }
    },
    120000,
  );

  it('Hubful singleton instance should initially be in DISCONNECTED status', async () => {
    expect(Hubful.status).toBe(EHubfulServiceStatus.DISCONNECTED);
  });

  it('correctly sets up the Hubful singleton instance', async () => {
    await setupHubfulInstance();
    expect(Hubful.status).toBe(EHubfulServiceStatus.CONNECTED);
  });

  let subscriptionId: string;

  it(`correctly subscribes a new handler to topic ${TOPIC}`, async () => {
    subscriptionId = await Hubful.subscribe(TOPIC, onTopicHandler);
    expect(typeof subscriptionId === 'string').toBe(true);
    expect(subscriptionId).toBeTruthy();
    expect(Hubful.subscriberService._eventsService._eventsMap.size).toBe(1);
  });

  it(`correctly publishes all ${randomValues.length} random values`, async () => {
    await expect(
      Promise.all(randomValues.map((value, index) => Hubful.publish(TOPIC, { value, index }))),
    ).resolves.not.toThrow();
  }, 10000);

  it(`correctly unsubscribes from ${TOPIC}`, async () => {
    expect(Hubful.subscriberService._eventsService._eventsMap.size).toBe(1);
    await expect(Hubful.unsubscribe(subscriptionId)).resolves.not.toThrow();
    expect(Hubful.subscriberService._eventsService._eventsMap.size).toBe(0);
  }, 10000);

  it(`correctly shuts down Hubful`, async () => {
    await Hubful.shutdown();
    expect(Hubful.status).toBe(EHubfulServiceStatus.DISCONNECTED);
  }, 10000);
});
