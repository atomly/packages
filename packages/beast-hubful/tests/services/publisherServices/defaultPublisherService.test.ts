// Libraries
import faker from 'faker';

// Dependencies
import { getDefaultPublisherService, getRandomInt } from '../../utils';

const TOPIC = faker.random.words();
const UNIT_TESTS_COUNT = 2500;
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

const defaultPublisherService = getDefaultPublisherService();

const randomValues = new Array(UNIT_TESTS_COUNT)
  .fill(undefined)
  .map(() => RANDOM_VALUE_GETTERS[getRandomInt(0, RANDOM_VALUE_GETTERS.length - 1)]())

describe('correctly publishes payloads', () => {
  async function onTopicHandler(topic: string, key: string): Promise<void> {
    expect(topic).toBe(TOPIC);
    const payload = await defaultPublisherService._storageService.get(key) as { value: string | number | boolean,  index: number };
    expect(payload).toBeTruthy();
    if (UNIT_TESTS_COUNT <= 5) {
      console.log('[onTopicHandler] key: ', key);
      console.log('[onTopicHandler] payload: ', payload);
      console.log('[onTopicHandler] randomValues[payload.index]: ', randomValues[payload!.index]);
      console.log('[onTopicHandler] payload.value === randomValues[payload.index]: ', payload!.value === randomValues[payload!.index]);
    }
    expect(payload!.value).toBe(randomValues[payload!.index]);
  }

  beforeAll(
    async () => {
      await Promise.all([
        defaultPublisherService._eventsService.start(),
        defaultPublisherService._eventsService.on(TOPIC, onTopicHandler),
      ]);
    },
    120000,
  );

  afterAll(
    async () => {
      await defaultPublisherService._eventsService.close();
    },
    120000,
  )

  it(`correctly publishes all ${randomValues.length} random values`, async () => {
    expect(randomValues.length).toBeTruthy();
    await Promise.all(randomValues.map((value, index) => defaultPublisherService.publish(TOPIC, { value, index })));
  }, 10000);
});
