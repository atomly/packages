// Libraries
import {
  Connection,
  ConnectionOptions,
  createConnection,
} from 'mongoose';

// Types
import {  DBContext } from './DBContext';

export abstract class DefaultDBContext<T> implements DBContext<T> {
  public connection: Connection;

  public collections: T;

  private connectionString: string;

  constructor(args: {
    connectionString: string;
    collections: T;
  }) {
    this.connectionString = args.connectionString;
    this.collections = args.collections;
  }

  public abstract async setup(connection: Connection): Promise<void>;

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
    await this.setup(this.connection);
  }

  public async close(callback?: (err?: unknown) => void): Promise<void> {
    try {
      await this.connection.close();
      if (callback) { callback(); }
    } catch (err) {
      if (callback) { callback(err); }
    } finally {
      delete this.connection;
    }
  }
}
