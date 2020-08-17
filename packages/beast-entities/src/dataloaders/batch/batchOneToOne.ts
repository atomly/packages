// Libraries
import { In } from 'typeorm';

// Dependencies
import { BaseEntity } from '../../entities';
import { DEFAULT_ENTITY_ID_KEY, DEFAULT_ORDER_CREATED_BY } from '../constants';

// Types
import { IBatchOneToOneConfig } from './types';

/**
 * Batch function for a DataLoader structured for a One to One relation
 * from the Entity to its parent.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param entity - TypeORM Entity that will be batched.
 * @param config - Configuration parameters for the batch function query.
 */
export async function batchOneToOne<T extends typeof BaseEntity>(
  ids: readonly string[],
  entity: T,
  batchConfig: IBatchOneToOneConfig<T> = {},
): Promise<T[]> {
  const {
    entityIdKey = DEFAULT_ENTITY_ID_KEY,
    config = {
      where: { [entityIdKey]: In(ids as string[]) },
      order: { createdAt: DEFAULT_ORDER_CREATED_BY },
    },
  } = batchConfig;
  // Setting up the necessary config object properties:
  if (!config.where) { config.where = { [entityIdKey!]: In(ids as string[]) }; }
  if (!config.order) { config.order = { createdAt: DEFAULT_ORDER_CREATED_BY }; }
  // Fetching entities, using the set entityIdKey parameter (defaults to `id`).
  const entities = await entity.find(config);
  // Entities map that will hold the fetched entities. Each parent ID will be assigned its respective entity.
  const entitiesMap: { [key: string]: T } = {};
  // Key identifier of the entity.
  const key = entityIdKey as keyof typeof entities[number];
  // Assigning the respective entities then returning them:
  entities.forEach(entity => {
    entitiesMap[entity[key] as unknown as string] = entity as unknown as T;
  });
  return ids.map(id => entitiesMap[id]);
}
