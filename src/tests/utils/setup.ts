// Dependencies
import { testConnection } from './testConnection';

/**
 * Called by `npm run test` and `npm run test:db_setup`
 * to clean up the database.
 */
testConnection(true).then(() => {
  // eslint-disable-next-line no-process-exit
  process.exit();
});
