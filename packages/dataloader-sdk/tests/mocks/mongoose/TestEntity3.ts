// Libraries
import {
  MongooseDBSchema,
  MongooseDBCollection,
} from '@atomly/mongoose-sdk';

export interface TestEntity3 {
  id: string;
  testEntities4Ids: string[];
}

const testEntity3Schema = new MongooseDBSchema<TestEntity3>({
  id: {
    type: MongooseDBSchema.Types.String,
    required: true,
  },
  testEntities4Ids: [{
    type: MongooseDBSchema.Types.String,
    required: true,
  }],
});

export const testEntity3Collection = new MongooseDBCollection({
  name: 'testEntity3',
  schema: testEntity3Schema,
  collectionName: 'test_entity_3',
});
