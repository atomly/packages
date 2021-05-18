export interface DbContext {
  connection: unknown;

  repositories: unknown;

  /**
   * Opens the connection to the database.
   * @param options - Connection options.
   */
  open(options?: unknown): Promise<void>;

  /**
   * Closes the connection to the database.
   * @param options - Connection options.
   */
  close(callback?: (err?: unknown) => void): Promise<void>;
}
