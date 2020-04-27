// Types
import { IEfficientBatchConfig } from './types';

/**
 * Batch function for a DataLoader structured for a Many to One relation
 * from the Entity to its parent.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param config - Configuration parameters for the batch function. Includes Entity, ID key,
 *                 order key, order by parameter, and entities fetched per id. 
 */
export async function efficientBatchManyToOne<T>(
  ids : readonly string[],
  {
    Entity,
    partitionEntityKey = 'id',
    orderEntityKey = 'createdAt',
    orderBy = 'DESC',
    entitiesPerId = 10,
  }: IEfficientBatchConfig,
): Promise<Array<T[]>> {
  // Fetching entities, if the custom idsKey exists we will use that one.
  const entities = await Entity.query(
    `
      SELECT
        *
      FROM (
        SELECT
          ROW_NUMBER() OVER (PARTITION BY "${partitionEntityKey}" ORDER BY "${orderEntityKey}" ${orderBy}) AS r,
          t.*
        FROM
          ${Entity.name.toLowerCase()} t
        WHERE t."${partitionEntityKey}" IN (${ids.join(', ')})) x
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
    entitiesMap[entity[partitionEntityKey]].push(entity);
  });
  return ids.map(id => entitiesMap[id]);
}
