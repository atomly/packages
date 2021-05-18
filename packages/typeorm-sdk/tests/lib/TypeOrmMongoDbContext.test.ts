// Libraries
import faker from 'faker';
import {
  Entity,
  BaseEntity,
  ReadPreference,
} from 'typeorm';

// Dependencies
import { TypeOrmMongoDbContext, MongoConnectionOptions } from '../../src';

//
// GLOBAL OBJECTS
//

const MONGO_CONNECTION_OPTIONS: MongoConnectionOptions = {
  type: 'mongodb',
  host: '127.0.0.1',
  port: 27017,
  readPreference: ReadPreference.PRIMARY,
  database: 'test',
}

@Entity()
class Foo extends BaseEntity {
  fooId: string;
}

@Entity()
class Bar extends BaseEntity {
  barId: string;
}

const dbContext = new TypeOrmMongoDbContext({
  Foo,
  Bar,
});

describe('MongooseDBContext works correctly', () => {
  // TODO: Test IntelliSense?
  test('IntelliSense works correctly', async () => {
    const { barId } = await dbContext.repositories.Bar.findOne({});
    const { fooId } = await dbContext.repositories.Foo.findOne({});
  });
});
