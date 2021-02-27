// Libraries
import {
  MongooseDBSchema,
  MongooseDBCollection,
} from '@atomly/mongoose-sdk';

export interface TestEntity4 {
  id: string;
  testEntity3Id: string;
}

const testEntity4Schema = new MongooseDBSchema<TestEntity4>({
  id: {
    type: MongooseDBSchema.Types.String,
    required: true,
  },
  testEntity3Id: {
    type: MongooseDBSchema.Types.String,
    required: true,
  },
});

export const testEntity4Collection = new MongooseDBCollection({
  name: 'testEntity4',
  schema: testEntity4Schema,
  collectionName: 'test_entity_4',
});
