// Dependencies
import { BaseEntity } from '../../entities';
import { DEFAULT_ENTITY_ID_KEY, DEFAULT_SQL_QUERY_ORDER_ENTITY_KEY, DEFAULT_SQL_QUERY_ORDER_BY, DEFAULT_SQL_QUERY_ENTITIES_PER_ID } from '../constants';

// Types
import { IBatchEfficientOneToManyConfig } from './types';

/**
  SELECT
    *
  FROM (
    SELECT
      ROW_NUMBER() OVER (PARTITION BY "memberId" ORDER BY "createdAt" DESC) AS r,
      t.*
    FROM
      posts t
    WHERE t."memberId" IN (1, 3)) x
  WHERE
    x.r <= 10;
 */

/**
 * Efficient batch function for a DataLoader structured for a Many to One relation
 * from the Entity to its parent, this limit the amount of fetched entities to a
 * set parameter, and it will fetch them by descending order of creation by default.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param entity - TypeORM Entity that will be batched.
 * @param config - Configuration parameters for the batch function SQL query. Includes ID key,
 * order key, order by parameter, and entities fetched per id. 
 */
export async function efficientBatchOneToMany<C extends typeof BaseEntity, T extends BaseEntity>(
  ids: readonly string[],
  entity: C,
  batchConfig: IBatchEfficientOneToManyConfig = {},
): Promise<Array<T[]>> {
  const {
    entityIdKey = DEFAULT_ENTITY_ID_KEY,
    config: {
      orderEntityKey = DEFAULT_SQL_QUERY_ORDER_ENTITY_KEY,
      orderBy = DEFAULT_SQL_QUERY_ORDER_BY,
      entitiesPerId = DEFAULT_SQL_QUERY_ENTITIES_PER_ID,
    } = {},
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
      WHERE t."${entityIdKey}" IN (${ids.map(id => `'${id}'`).join(', ')}) /* [As documented in the manual, string constants (or in general: anything that is not a number, e.g. UUIDs) need to be enclosed in single quotes.] */
    ) AS x
    WHERE x.r <= ${entitiesPerId};
  `;
  // Fetching entities, if the custom idsKey exists we will use that one.
  const entities = await entity.query(query);
  // Entities map init that will be filled with the fetched entities.
  // Each parent ID will be assigned its respective entitie(s).
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
