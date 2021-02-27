// Libraries
import {
  MongooseDBSchema,
  MongooseDBCollection,
} from '@atomly/mongoose-sdk';


export interface TestEntity1 {
  id: string;
  testEntity2Id: string;
}

const testEntity1Schema = new MongooseDBSchema<TestEntity1>({
  id: {
    type: MongooseDBSchema.Types.String,
    required: true,
  },
  testEntity2Id: {
    type: MongooseDBSchema.Types.String,
    required: true,
  },
});

export const testEntity1Collection = new MongooseDBCollection({
  name: 'testEntity1',
  schema: testEntity1Schema,
  collectionName: 'test_entity_1',
});
