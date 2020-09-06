// Libraries
import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
  getConnectionOptions,
} from 'typeorm';

/**
 * Database manager class.
 * TODO:
 *  - Improve architecture of this class.
 *  - Remove hardcoded shit.
 *  - Use magic variables if necessary.
 */
export class Database {
  public connection: Connection;

  private connectionManager: ConnectionManager;
  private ormConfig: Partial<ConnectionOptions>;

  constructor(ormConfig: Partial<ConnectionOptions>) {
    this.connectionManager = getConnectionManager();
    this.ormConfig = ormConfig;
  }

  public async getConnection(CONNECTION_NAME = 'default'): Promise<Connection> {
    // If the connection is created, connect it if necessary.
    if (this.connectionManager.has(CONNECTION_NAME)) {
      this.connection = this.connectionManager.get(CONNECTION_NAME);
      if (!this.connection.isConnected) {
        try {
          this.connection = await this.connection.connect();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('DEBUG: Connection error: ', error);
          throw new Error(error.message);
        }
      }
    // Otherwise, if the connection does not exist, create it:
    } else {
      // If there are connection options in the environment variables,
      // connect to the database with them.
      try {
        const connectionOptions = await getConnectionOptions();
        this.connection = await createConnection({
          ...connectionOptions,
          ...this.ormConfig,
          name: CONNECTION_NAME,
          entities: this.ormConfig.entities,
        } as ConnectionOptions);
      // Otherwise, only use the ormConfig variables.
      } catch(error) {
        // eslint-disable-next-line no-console
        this.connection = await createConnection({
          ...this.ormConfig,
          name: CONNECTION_NAME,
          entities: this.ormConfig.entities,
        } as ConnectionOptions);
      }
    }
    // Return connection.
    return this.connection;
  }

  public async closeConnection(): Promise<void> {
    await this.connection.close();
  }

  public async deleteEntities(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const databaseHost = this.connection.options.host as string;
    const databaseName = this.connection.options.database;
    // Only drop databases that are locally hosted and that
    // the name match the 'beast_sandbox_test' pattern.
    if (
      (
        databaseHost === 'localhost' ||
        databaseHost === '192.168.99.101'
      ) &&
      databaseName === 'beast_sandbox_test'
    ) {
      // DELETE entities but not the tables:
      for (const entity of this.ormConfig.entities) {
        await this.connection.getRepository(entity).delete({});
      }
    } else {
      // eslint-disable-next-line no-console
      console.warn('DEBUG: Only the *beast_sandbox_test* database can be dropped through TypeORM.');
    }
  }
}
