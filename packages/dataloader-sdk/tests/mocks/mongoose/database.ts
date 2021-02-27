// Libraries
import {
  MongooseDBContext,
} from '@atomly/mongoose-sdk';

// Dependencies
import { testEntity1Collection } from './TestEntity1';
import { testEntity2Collection } from './TestEntity2';
import { testEntity3Collection } from './TestEntity3';
import { testEntity4Collection } from './TestEntity4';

const DB_CONNECTION_STRING = 'mongodb://127.0.0.1:27017/?readPreference=primary';

export const dbContext = new MongooseDBContext({
  connectionString: DB_CONNECTION_STRING,
  collections: {
    TestEntity1: testEntity1Collection,
    TestEntity2: testEntity2Collection,
    TestEntity3: testEntity3Collection,
    TestEntity4: testEntity4Collection,
  },
});

