// Types
import { Connection, ConnectionOptions } from 'mongoose';

export interface DBContext<T extends object> {
  connection: Connection | null;

  collections: T;

  /**
   * Setup function for the collections. Called right after opening the connection to the database
   * by the `open` method. Used to set up collections, and such.
   * @param connection - DB connection.
   */
  setup(connection: Connection): void;

  /**
   * Opens the connection to the database.
   * @param options - Connection options.
   */
  open(options?: ConnectionOptions): Promise<void>;

  /**
   * Closes the connection to the database.
   * @param options - Connection options.
   */
  close(callback?: (err?: unknown) => void): Promise<void>;
}
