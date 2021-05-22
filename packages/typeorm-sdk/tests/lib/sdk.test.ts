// Libraries
import faker from 'faker';
import {
  Entity,
  PrimaryColumn,
} from 'typeorm';

// Dependencies
import { MongoBaseEntity, MongoDbContext, MongoConnectionOptions } from '../../src';

//
// GLOBAL OBJECTS
//

const MONGO_CONNECTION_OPTIONS: MongoConnectionOptions = {
  type: 'mongodb',
  host: '127.0.0.1',
  port: 27017,
  readPreference: 'primary',
  database: 'test',
}

@Entity()
class Bar extends MongoBaseEntity {
  @PrimaryColumn()
  barId: string;
}

@Entity()
class Foo extends MongoBaseEntity {
  @PrimaryColumn()
  fooId: string;
}

let dbContext: MongoDbContext<{
  Bar: typeof Bar;
  Foo: typeof Foo;
}>;

describe('MongooseDBContext & MongoBaseEntity works correctly', () => {
  test('MongoDbContext instantiates correctly', async () => {
    dbContext = new MongoDbContext({
      Bar,
      Foo,
    });

    expect(dbContext.repositories).toBeFalsy();
  });

  test('correctly opens a connection', async () => {
    await expect(dbContext.open(MONGO_CONNECTION_OPTIONS)).resolves.not.toThrow();

    expect(dbContext.connection.isConnected).toBe(true);
    expect(dbContext.repositories.Bar).toBeTruthy();
    expect(dbContext.repositories.Foo).toBeTruthy();
  });

  test('repositories of MongoBaseEntity instances work correctly', async () => {
    let entity: Bar | Foo;

    for await (const repository of [dbContext.repositories.Bar, dbContext.repositories.Foo]) {
      const uuid = faker.random.uuid();

      if (repository === dbContext.repositories.Bar) {
        entity = repository.create({ barId: uuid });
      } else {
        entity = repository.create({ fooId: uuid });
      }

      await expect(entity.save()).resolves.toMatchObject(entity);

      await expect(repository.findOne(entity)).resolves.toMatchObject(entity);
    }
  });

  test('correctly closes a connection', async () => {
    await expect(dbContext.close()).resolves.not.toThrow();

    expect(dbContext.connection!.isConnected).toBe(false);
  });
});
