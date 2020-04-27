
// Libraries
import { createConnection, getConnectionOptions, Connection } from 'typeorm';

/**
 * Sometimes when we perform a test we want to drop the schema and
 * synchronize the DB tables to clean up the database.
 * @param drop - Drop parameter.
 */
export async function testConnection(drop: boolean): Promise<Connection> {
  const connectionOptions = await getConnectionOptions();
  const connection = await createConnection({
    ...connectionOptions,
    synchronize: drop,
    dropSchema: drop,
  });
  return connection;
}
