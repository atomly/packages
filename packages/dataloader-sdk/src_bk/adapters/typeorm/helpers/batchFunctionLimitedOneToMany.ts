// Libraries
import { BaseEntity } from 'typeorm';

// Dependencies
import {
  DEFAULT_ENTITY_ID_KEY,
  DEFAULT_SQL_QUERY_ORDER_ENTITY_KEY,
  DEFAULT_SQL_QUERY_ORDER_BY,
  DEFAULT_SQL_QUERY_ENTITIES_PER_ID,
} from './constants';

// Types
import { TypeORMBatchFunctionLimitedOneToManyConfig } from '../types';

/**
 * Limited batch function for a DataLoader structured for a One to Many relation
 * from the Entity to its related entity, this limits the amount of fetched entities to a
 * set parameter, and it will fetch them by descending order of creation by default.
 * @param ids - Array of IDs coming from the related entity that will batch this Entity.
 * @param entity - TypeORM Entity that will be batched.
 * @param config - Configuration parameters for the batch function SQL query. Includes ID key,
 * order key, order by parameter, and entities fetched per id. 
 */
export async function batchFunctionLimitedOneToMany<T extends BaseEntity, K extends new() => T>(
  ids: readonly string[],
  entity: K,
  batchConfig: TypeORMBatchFunctionLimitedOneToManyConfig<T> = {},
): Promise<T[][]> {
  const {
    entityIdKey = DEFAULT_ENTITY_ID_KEY,
    orderEntityKey = DEFAULT_SQL_QUERY_ORDER_ENTITY_KEY,
    orderBy = DEFAULT_SQL_QUERY_ORDER_BY,
    entitiesPerId = DEFAULT_SQL_QUERY_ENTITIES_PER_ID,
  } = batchConfig;
  /**
   * The `ROW_NUMBER()` is a window function that assigns a sequential integer
   * to each row within the partition of a result set. The row number
   * starts with 1 for the first row in each partition.
   * 
   * The `PARTITION BY` clause divides the result set into partitions
   * (another term for groups of rows). The `ROW_NUMBER()` function is
   * applied to each partition separately and reinitialized the row
   * number for each partition. 
   * 
   * The `ORDER BY` clause defines the logical order of the rows within each
   * partition of the result set. The `ORDER BY` clause is mandatory because
   * the `ROW_NUMBER()` function is order sensitive.
   * 
   * **NOTE:** As documented in the manual, string constants (or in general: anything
   * that is not a number, e.g. UUIDs) need to be enclosed in single quotes.
   *
   * - [Row Number Function](https://www.sqlservertutorial.net/sql-server-window-functions/sql-server-row_number-function/).
   * - [SQL Syntax Constants](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS).
   */
  const query = `
    SELECT *
    FROM (
      SELECT
        ROW_NUMBER() OVER (
          PARTITION BY "${entityIdKey}"
          ORDER BY "${orderEntityKey}" ${orderBy} /* [orderBy: ASC | DESC] */
        ) AS r, t.*
      FROM "test_entity_4" AS t /* ['t': The name of the entity table ${entity.name.toLowerCase()}] */
      WHERE t."${entityIdKey}" IN (${ids.map(id => `'${id}'`).join(', ')})
    ) AS x
    WHERE x.r <= ${entitiesPerId};
  `;
  // Fetching entities, if the custom idsKey exists we will use that one.
  const entities = await (entity as unknown as typeof BaseEntity).query(query);
  // Entities map init that will be filled with the fetched entities.
  // Each related entity ID will be assigned its respective entitie(s).
  const entitiesMap = ids.reduce((map: Record<string, Array<T>>, id) => {
    map[id] = [];
    return map;
  }, {});
  // Assigning its respective entitie(s).
  entities.forEach((entity: never) => {
    entitiesMap[entity[entityIdKey]].push(entity);
  });
  return ids.map(id => entitiesMap[id]);
}
