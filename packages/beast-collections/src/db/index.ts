// Libraries
import { Connection, ConnectionOptions, createConnection } from 'mongoose';

// Dependencies
import { schemas } from '../schemas';

// Types
import {
  IDBContextModels,
  IDBContextDocuments,
  IDBContextParamConnection,
  IDBContextParamConnectionString,
  IDBContext,
} from './types';

export class DBContext implements IDBContext {
  constructor(args: IDBContextParamConnectionString | IDBContextParamConnection) {
    // If a DB connection String is sent as a parameter, then the `setup`
    // function needs to be executed.
    // Otherwise, if a connection is sent, then set up the models with it
    if ((args as IDBContextParamConnectionString).dbConnectionString) {
      this.dbConnectionString = (args as IDBContextParamConnectionString).dbConnectionString;
    } else if ((args as IDBContextParamConnection).connection) {
      this.connection = (args as IDBContextParamConnection).connection;
      this.setModels();
    }
  }

  private dbConnectionString: string;

  public connection: Connection;
  public models: IDBContextModels;

  private setModels(): void {
    if (!this.models) {
      this.models = {
        Subscriber: this.connection.model<IDBContextDocuments['Subscriber']>('Subscriber', schemas.subscribersSchema, 'subscriber'),
      };
    }
  }

  public async setup(options?: ConnectionOptions): Promise<void> {
    if (!this.connection) {
      const connection: Connection = await createConnection(
        this.dbConnectionString,
        Object.assign<unknown, Partial<ConnectionOptions>, ConnectionOptions>(
          {},
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            /**
             * Setting `useCreateIndex: true,` avoids the deprecation warning:
             *    `DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.`
             * (GitHub Issue)[https://github.com/nodkz/mongoose-plugin-autoinc/issues/26]
             */
            useCreateIndex: true,
          },
          options ?? {},
        ),
      );
      // Bindings
      this.connection = connection;
    }
    this.setModels();
  }
}
