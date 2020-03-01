
// Libraries
import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
  getConnectionOptions,
  Repository,
} from 'typeorm'

// Dependencies
import ormConfig from '@root/ormconfig';

// Entities
import { User } from '@entity/User';
import { Post } from '@entity/Post';

/**
 * Database manager class.
 */
export class Database {
  constructor() {
    this.connectionManager = getConnectionManager();
  }

  //
  // Members
  //

  private connectionManager: ConnectionManager;
  public connection: Connection;

  // Repositories
  public User: Repository<User>;
  public Post: Repository<Post>;

  /**
   * Connects the TypeORM manager to the PostgreSQL database.
   */
  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`; // Do not change, data loaders are using this connection name.
    // If the connection is created, connect it if necessary.
    if (this.connectionManager.has(CONNECTION_NAME)) {
      this.connection = this.connectionManager.get(CONNECTION_NAME);
      if (!this.connection.isConnected) {
        try {
          this.connection = await this.connection.connect();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('error: ', error);
          throw new Error(error.message);
        }
      }
    // Otherwise, if the connection does not exist, create it:
    } else {
      const connectionOptions: ConnectionOptions = await getConnectionOptions();
      this.connection = await createConnection({
        ...connectionOptions,
        ...ormConfig,
        name: CONNECTION_NAME,
        entities: [
          User,
          Post,
        ],
      });
      this.User = this.connection.getRepository(User)
      this.Post = this.connection.getRepository(Post)
    }
    // Return connection.
    return this.connection;
  }
}
