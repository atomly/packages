// Libraries
import {
  BaseEntity,
  Connection,
  ConnectionOptions,
  MongoRepository,
  createConnection,
  getMongoRepository,
} from 'typeorm';

// Relatives
import { DbContext } from './DbContext';
import { MongoConnectionOptions, MongoRepositories, TypeOrmEntitiesMap } from './types';

export class MongoDbContext<T extends TypeOrmEntitiesMap> implements DbContext {
  public connection: Connection;

  public repositories: MongoRepositories<T>;

  private entities: T;

  constructor(entities: T) {
    this.entities = entities;
  }

  public async open(mongoOptions: MongoConnectionOptions): Promise<void> {
    console.log('this.entities: ', this.entities);
    const options: ConnectionOptions = {
      ...mongoOptions as ConnectionOptions,
      entities: Object.values(this.entities),
    };

    this.connection = await createConnection(options);

    this.repositories = MongoDbContext.setup(this.entities, this.connection.name);
  }

  public async close(callback?: (err?: unknown) => void): Promise<void> {
    try {
      await this.connection?.close();
      if (callback) { callback(); }
    } catch (err) {
      if (callback) { callback(err); }
    }
  }

  /**
   * Setup function for the entity repositories. Called right after opening the connection to the database
   * by the `open` method. Used to set up repositories, and such.
   * @param connection - DB connection.
   */
  static setup<T extends TypeOrmEntitiesMap>(entities: T, connectionName?: string | undefined): MongoRepositories<T> {
    const repositories: MongoRepositories<T> = Object.entries(entities).reduce<Partial<MongoRepositories<T>>>(
      (acc, entry: [keyof T, typeof BaseEntity]) => {
        const [key, entity] = entry;

        acc[key] = getMongoRepository<typeof entity>(entity, connectionName) as MongoRepository<InstanceType<T[keyof T]>>;

        return acc;
      },
      {},
    ) as MongoRepositories<T>;

    return repositories;
  }
}
