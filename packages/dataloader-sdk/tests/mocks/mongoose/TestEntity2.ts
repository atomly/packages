// Libraries
import {
  MongooseDBSchema,
  MongooseDBCollection,
} from '@atomly/mongoose-sdk';

export interface TestEntity2 {
  id: string;
  testEntity1Id: string;
}

const testEntity2Schema = new MongooseDBSchema<TestEntity2>({
  id: {
    type: MongooseDBSchema.Types.String,
    required: true,
  },
  testEntity1Id: {
    type: MongooseDBSchema.Types.String,
    required: true,
  },
});

export const testEntity2Collection = new MongooseDBCollection({
  name: 'testEntity2',
  schema: testEntity2Schema,
  collectionName: 'test_entity_2',
});
