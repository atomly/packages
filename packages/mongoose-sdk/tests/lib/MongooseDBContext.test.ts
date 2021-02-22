// Libraries
import faker from 'faker';

// Dependencies
import { MongooseDBContext } from '../../src';
import { testCollection } from '../mocks';

//
// CONSTANTS
//

const DB_CONNECTION_STRING = 'mongodb://127.0.0.1:27017/?readPreference=primary';
const TEST_ENTITITIES_AMOUNT = 10;

//
// FIXTURE
//

const collections = {
  TestCollection: testCollection,
};

const dbContext = new MongooseDBContext({
  connectionString: DB_CONNECTION_STRING,
  collections,
});

const randomTestCollectionEmails: string[] = new Array(TEST_ENTITITIES_AMOUNT)
  .fill(undefined)
  .map(() => faker.internet.email());

describe('MongooseDBContext works correctly', () => {
  beforeAll(
    async () => {
      await dbContext.open();
    },
    120000,
  );

  afterAll(
    async () => {
      await dbContext.close();
    },
    120000,
  );

  it('successfully opens the dbContext', async () => {
    expect(dbContext.connection?.readyState).toBe(1);
  });

  test('connection has the correct model names', () => {
    expect(dbContext.connection?.modelNames()).toMatchObject(Object
      .values(collections)
      .map(collection => collection.name),
    );
  });

  test('connection has the correct collection names', () => {
    expect(Object.keys(dbContext.connection?.collections!)).toMatchObject(Object
      .values(collections)
      .map(collection => collection.collectionName),
    );
  });

  it('successfully creates the documents for the test collection', async () => {
    const testCollections = randomTestCollectionEmails.map(email => ({
      email,
      fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      reference: faker.internet.domainName(),
    }))
    const createdTestCollections = await dbContext.collections
      .TestCollection
      .model
      .insertMany(testCollections);
    expect(createdTestCollections).toHaveLength(TEST_ENTITITIES_AMOUNT);
  });

  it('successfully finds the documents for the test collection', async () => {
    const testCollections = await dbContext.collections
      .TestCollection
      .model
      .find({});
    expect(testCollections).toHaveLength(TEST_ENTITITIES_AMOUNT);
  });

  it('successfully deletes the documents for the test collection', async () => {
    const testCollections = await dbContext.collections
      .TestCollection
      .model
      .deleteMany({});
    expect(testCollections.deletedCount).toBe(TEST_ENTITITIES_AMOUNT);
    expect(testCollections.deletedCount).toBe(TEST_ENTITITIES_AMOUNT);
  });
});
