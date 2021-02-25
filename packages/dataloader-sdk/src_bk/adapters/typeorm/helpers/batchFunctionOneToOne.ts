// Libraries
import { In, BaseEntity } from 'typeorm';

// Dependencies
import { DEFAULT_ENTITY_ID_KEY } from './constants';

// Types
import { TypeORMBatchFunctionOneToOneConfig } from '../types';

/**
 * Batch function for a DataLoader structured for a One to One relation
 * from the Entity to its related entity.
 * @param ids - Array of IDs coming from the related entity that will batch this Entity.
 * @param entity - TypeORM Entity that will be batched.
 * @param config - Configuration parameters for the batch function query.
 */
export async function batchFunctionOneToOne<T extends BaseEntity, K extends new() => T>(
  ids: readonly string[],
  entity: K,
  batchConfig: TypeORMBatchFunctionOneToOneConfig<T> = {},
): Promise<T[]> {
  const {
    entityIdKey = DEFAULT_ENTITY_ID_KEY,
    query = {} as TypeORMBatchFunctionOneToOneConfig<T>['query'],
  } = batchConfig;
  // Setting up the default config object properties:
  query!.where = { [entityIdKey!]: In(ids as string[]) };
  // Fetching entities, using the set entityIdKey parameter (defaults to `id`).
  const entities = await (entity as unknown as typeof BaseEntity).find(query);
  // Entities map that will hold the fetched entities. Each related entity ID will be assigned its respective entity.
  const entitiesMap: { [key: string]: T } = {};
  // Key identifier of the entity.
  const key = entityIdKey as keyof typeof entities[number];
  // Assigning the respective entities then returning them:
  entities.forEach(entity => {
    entitiesMap[entity[key] as unknown as string] = entity as unknown as T;
  });
  return ids.map(id => entitiesMap[id]);
}
