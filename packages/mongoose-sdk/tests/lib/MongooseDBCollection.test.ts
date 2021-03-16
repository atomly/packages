// Libraries
import faker from 'faker';

// Dependencies
import {
  MongooseDBCollection,
  MongooseDBSchema,
} from '../../src';

//
// CONSTANTS
//
const MODEL_NAME = faker.random.uuid();
const COLLECTION_NAME = faker.random.uuid();

//
// FIXTURE
//

interface TestCollection {
  id: number;
}

const testCollectionSchema = new MongooseDBSchema<TestCollection>({
  id:  {
    type: String,
    required: true,
    unique: true,
  },
});

const testCollection = new MongooseDBCollection<TestCollection>({
  name: MODEL_NAME,
  schema: testCollectionSchema,
  collectionName: COLLECTION_NAME,
});

interface FooCollection {
  foo: string;
}

const fooCollectionSchema = new MongooseDBSchema<FooCollection>({
  foo:  {
    type: String,
    required: true,
    unique: true,
  },
});

const fooCollection = new MongooseDBCollection<FooCollection>({
  name: faker.random.uuid(),
  schema: fooCollectionSchema,
  collectionName: faker.random.uuid(),
});

describe('MongooseDBCollection instantiated correctly', () => {
  it('correctly instantiates the testCollection', () => {
    expect(testCollection.name).toBe(MODEL_NAME);

    expect(testCollection.collectionName).toBe(COLLECTION_NAME);
  });

  test('model should initially be defined', () => {
    expect(testCollection.Model).toBeTruthy();
  });

  it('correctly instantiates the fooCollection using MongooseDBSchema for the schema', () => {
    expect(fooCollection.name).toBeTruthy();

    expect(fooCollection.schema).toBeTruthy();

    expect(fooCollection.collectionName).toBeTruthy();
  });
});
