// Libraries
import {
  Connection,
  ConnectionOptions,
  createConnection,
} from 'mongoose';

// Types
import { DBContext } from './DBContext';
import { DBCollection } from './DBCollection';

export class MongooseDBContext<T extends Record<string, DBCollection<unknown>>> implements DBContext<T> {
  public connection: Connection | null = null;

  public collections: T;

  private connectionString: string;

  constructor(args: {
    connectionString: string;
    collections: T;
  }) {
    this.connectionString = args.connectionString;
    this.collections = args.collections;
  }

  public setup(connection: Connection): void {
    for (const collection of Object.values(this.collections)) {
      collection.setup(connection);
    }
  }

  public async open(options?: ConnectionOptions): Promise<void> {
    if (!this.connection) {
      const connection: Connection = await createConnection(
        this.connectionString,
        Object.assign<unknown, Partial<ConnectionOptions>, ConnectionOptions>(
          {},
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            /**
             * Setting `useCreateIndex: true,` avoids the deprecation warning:
             * `DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.`
             * [GitHub Issue](https://github.com/nodkz/mongoose-plugin-autoinc/issues/26).
             */
            useCreateIndex: true,
          },
          options ?? {},
        ),
      );

      // Bindings
      this.connection = connection;
    }

    this.setup(this.connection);
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
}
