// Libraries
import { In, BaseEntity } from 'typeorm';

// Dependencies
import { DEFAULT_ENTITY_ID_KEY, DEFAULT_ORDER_BY_KEY, DEFAULT_ORDER_BY_VALUE } from './constants';

// Types
import { TypeORMQuery, TypeORMBatchFunctionOneToManyConfig } from '../types';

/**
 * Batch function for a DataLoader structured for a One to Many relation
 * from the Entity to its related entity.
 * @param ids - Array of IDs coming from the related entity that will batch this Entity.
 * @param entity - TypeORM Entity that will be batched.
 * @param query - Configuration parameters for the batch function query. 
 */
export async function batchFunctionOneToMany<T extends BaseEntity, K extends new() => T>(
  ids: readonly string[],
  entity: K,
  batchConfig: TypeORMBatchFunctionOneToManyConfig<T> = {},
): Promise<T[][]> {
  const {
    entityIdKey = DEFAULT_ENTITY_ID_KEY,
    query = {} as TypeORMBatchFunctionOneToManyConfig<T>['query'],
    take,
  } = batchConfig;
  // Setting up the default query object properties:
  query!.where = { [entityIdKey!]: In(ids as string[]) };
  if (!(query!.order)) { query!.order = { [DEFAULT_ORDER_BY_KEY]: DEFAULT_ORDER_BY_VALUE } as TypeORMQuery<T>['order']; }
  if (!(query!.take) && take) { query!.take = take(ids); }
  // Fetching entities, using the set entityIdKey parameter (defaults to `id`).
  const entities = await (entity as unknown as typeof BaseEntity).find(query);
  // Entities map that will hold the fetched entities. Each related entity ID will be assigned its respective entity.
  const entitiesMap = ids.reduce((map: Record<string, T[]>, id) => {
    map[id] = [] as unknown as T[];
    return map;
  }, {});
  // Key identifier of the entity.
  const key = entityIdKey as keyof typeof entities[number];
  // Assigning the respective entities then returning them:
  entities.forEach(entity => {
    (entitiesMap[entity[key] as unknown as string] as unknown as Array<unknown>).push(entity);
  });
  return ids.map(id => entitiesMap[id]);
}
