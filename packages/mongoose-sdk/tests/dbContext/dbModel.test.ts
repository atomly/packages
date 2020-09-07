// Libraries
import faker from 'faker';
import { Schema, Document } from 'mongoose';

// Dependencies
import { DefaultDBCollection } from '../../src'

//
// CONSTANTS
//
const MODEL_NAME = faker.random.uuid();
const COLLECTION_NAME = faker.random.uuid();

//
// FIXTURE
//

interface TestCollection extends Document {
  id: string;
}

const testCollectionSchema = new Schema<TestCollection>({
  id:  {
    type: String,
    required: true,
    unique: true,
  },
});

const testCollection = new DefaultDBCollection<TestCollection>({
  name: MODEL_NAME,
  schema: testCollectionSchema,
  collectionName: COLLECTION_NAME,
});

describe('DefaultDBContext instantiated correctly', () => {
  it('correctly instantiates the testCollection', () => {
    expect(testCollection.name).toBe(MODEL_NAME);
    expect(testCollection.collectionName).toBe(COLLECTION_NAME);
  });

  test('model should initially be undefined until it is set up with the connection', () => {
    expect(testCollection.model).toBeUndefined();
  });
});
