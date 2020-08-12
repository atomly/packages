// Dependencies
import { DEFAULT_ENTITY_ID_KEY, DEFAULT_SQL_QUERY_ORDER_ENTITY_KEY, DEFAULT_SQL_QUERY_ORDER_BY, DEFAULT_SQL_QUERY_ENTITIES_PER_ID } from '../constants';

// Types
import { Entity } from '../../entities';
import { IBatchEfficientOneToManyConfig } from './types';

/**
 * Efficient batch function for a DataLoader structured for a Many to One relation
 * from the Entity to its parent, this limit the amount of fetched entities to a
 * set parameter, and it will fetch them by descending order of creation by default.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param entity - TypeORM Entity that will be batched.
 * @param config - Configuration parameters for the batch function SQL query. Includes ID key,
 * order key, order by parameter, and entities fetched per id. 
 */
export async function efficientBatchOneToMany<T extends Entity>(
  ids: readonly string[],
  entity: T,
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
  // Fetching entities, if the custom idsKey exists we will use that one.
  const entities = await entity.query(
    `
      SELECT
        *
      FROM (
        SELECT
          ROW_NUMBER() OVER (PARTITION BY "${entityIdKey}" ORDER BY "${orderEntityKey}" ${orderBy}) AS r,
          t.*
        FROM
          ${entity.name.toLowerCase()} t
        WHERE t."${entityIdKey}" IN (${ids.join(', ')})) x
      WHERE
        x.r <= ${entitiesPerId};
    `,
  );
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
