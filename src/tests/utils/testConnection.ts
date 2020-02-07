
// Libraries
import { createConnection, getConnectionOptions, Connection } from 'typeorm';

// Dependenies
import ormConfig from '../../../ormconfig';

/**
 * Sometimes when we perform a test we want to drop the schema and
 * synchronize the DB tables to clean up the database.
 * @param drop - Drop parameter.
 */
export async function testConnection(drop: boolean): Promise<Connection> {
  const connectionOptions = await getConnectionOptions();
  return createConnection({
    ...connectionOptions,
    ...ormConfig,
    synchronize: drop,
    dropSchema: drop,
  });
}
