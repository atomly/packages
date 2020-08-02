// Libraries
import faker from 'faker';
import { isAsyncIterable } from 'iterall';
import { parse, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { subscribe } from 'graphql/subscription';

// Dependencies
import Hubful, { HubfulAsyncIterator, EHubfulServiceStatus } from '../../src';

// Utils
import { setupHubfulInstance, wait } from '../utils';

const WAIT_TIMER = 50;
const FIRST_TOPIC = 'FIRST_TOPIC';
const SECOND_TOPIC = 'SECOND_TOPIC';

function buildSchema<T = unknown>(regularIterator: AsyncIterator<T>, patternIterator: AsyncIterator<T>): GraphQLSchema {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        testString: {
          type: GraphQLString,
          resolve: function(): string {
            return 'it just works';
          },
        },
      },
    }),
    subscription: new GraphQLObjectType({
      name: 'Subscription',
      fields: {
        testSubscription: {
          type: GraphQLString,
          subscribe(): AsyncIterator<T> {
            return regularIterator;
          },
          resolve(): string {
            return FIRST_TOPIC;
          },
        },
        testPatternSubscription: {
          type: GraphQLString,
          subscribe(): AsyncIterator<T> {
            return patternIterator;
          },
          resolve(): string {
            return SECOND_TOPIC;
          },
        },
      },
    }),
  });
}

describe('correctly publishes payloads', () => {
  const regularQuery = parse(`
    subscription S1 {
      testSubscription
    }
  `);

  const regularIterator = new HubfulAsyncIterator({
    hubful: Hubful,
    topics: FIRST_TOPIC,
  });

  const patternQuery = parse(`
    subscription S1 {
      testPatternSubscription
    }
  `);

  const patternIterator = new HubfulAsyncIterator({
    hubful: Hubful,
    topics: `${SECOND_TOPIC.slice(0, 6)}*`,
    options: {
      pattern: true,
    },
  });

  let schema: GraphQLSchema;

  beforeAll(
    async () => {
      await setupHubfulInstance();
      schema = buildSchema(regularIterator, patternIterator);
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

  it('should allow regular subscriptions', async () => {
    const mockFunction = jest.fn();
    const asyncIterator = await subscribe(schema, regularQuery);
    const payload = { value: faker.random.words() };
    expect(isAsyncIterable(asyncIterator)).toBe(true);
    // eslint-disable-next-line jest/valid-expect-in-promise
    (asyncIterator as AsyncIterator<unknown>)
      .next()
      .then(res => {
        mockFunction();
        console.log('regular subscription response: ', res);
        expect(res.value.data.testSubscription).toBe(FIRST_TOPIC);
      });
    await Hubful.publish(FIRST_TOPIC, payload);
    await wait(WAIT_TIMER);
    expect(mockFunction.mock.calls).toHaveLength(1);
  });

  it('should allow pattern subscriptions', async () => {
    const mockFunction = jest.fn();
    const asyncIterator = await subscribe(schema, patternQuery);
    const payload = { value: faker.random.words() };
    expect(isAsyncIterable(asyncIterator)).toBe(true);
    // eslint-disable-next-line jest/valid-expect-in-promise
    (asyncIterator as AsyncIterator<unknown>)
      .next()
      .then(res => {
        mockFunction();
        console.log('pattern subscription response: ', res);
        expect(res.value.data.testPatternSubscription).toBe(SECOND_TOPIC);
      });
    await Hubful.publish(SECOND_TOPIC, payload);
    await wait(WAIT_TIMER);
    expect(mockFunction.mock.calls).toHaveLength(1);
  });

  it('should clear topic handlers', async () => {
    const asyncIterator = await subscribe(schema, regularQuery);
    const spy = jest.spyOn(asyncIterator as AsyncIterator<unknown>, 'return');
    const payload = { value: faker.random.words() };
    expect(isAsyncIterable(asyncIterator)).toBe(true);
    await Promise.all([
      Hubful.publish(FIRST_TOPIC, payload),
      (asyncIterator as AsyncIterator<unknown>).return!(),
    ]);
    await wait(WAIT_TIMER);
    expect(spy.mock.calls).toHaveLength(1);
  });
});
