// Types
import { QueryRunner } from 'typeorm';
import { Database } from '../../database';

interface ITransactionConfig<T, C> {
  try(queryRunner: QueryRunner, database: Database): Promise<T>,
  catch?(queryRunner: QueryRunner, error: Error): Promise<C>,
  finally?(queryRunner: QueryRunner, database: Database): Promise<void>,
}

/**
 * Try to execute a DB transaction. If for any reason it fails, the transaction
 * is rolled back then the errors are returned.
 * Otherwise, the transaction is committed, and the user is returned.
 * @param database - Database connection.
 * @param config - Hook functions that will execute while the transaction is running,
 *                 if the transaction fails, or when the transaction is over but before
 *                 it releases.
 */
export async function transaction<T = void, C = Error>(
  database: Database,
  config: ITransactionConfig<T, C>,
): Promise<T | C> {
  const queryRunner = database.connection.createQueryRunner();
  let result: T | C;
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    result = await config.try(queryRunner, database);
    // Commit after try
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    if (config.catch) {
      await config.catch(queryRunner, error);
    }
    result = error as C;
  } finally {
    if (config.finally) {
      await config.finally(queryRunner, database);
    }
    await queryRunner.release();
  }
  return result;
}
