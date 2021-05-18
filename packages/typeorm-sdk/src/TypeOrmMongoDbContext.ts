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

// eslint-disable-next-line @typescript-eslint/ban-types
export class TypeOrmMongoDbContext<T extends TypeOrmEntitiesMap> implements DbContext {
  public connection: Connection | null = null;

  public repositories: MongoRepositories<T>;

  private entities: T;

  constructor(entities: T) {
    this.entities = entities;
    this.repositories = TypeOrmMongoDbContext.setup(this.entities);
  }

  public async open(options: MongoConnectionOptions): Promise<void> {
    this.connection = await createConnection(options as ConnectionOptions);

    this.repositories = TypeOrmMongoDbContext.setup(this.entities, this.connection.name);
  }

  public async close(callback?: (err?: unknown) => void): Promise<void> {
    try {
      await this.connection?.close();
      if (callback) { callback(); }
    } catch (err) {
      if (callback) { callback(err); }
    } finally {
      this.connection = null;
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
