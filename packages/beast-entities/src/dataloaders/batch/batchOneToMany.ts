// Libraries
import { In } from 'typeorm';

// Dependencies
import { BaseEntity } from '../../entities';
import { DEFAULT_ENTITY_ID_KEY, DEFAULT_ORDER_CREATED_BY } from '../constants';

// Types
import { IBatchOneToManyConfig } from './types';

/**
 * Batch function for a DataLoader structured for a Many to One relation
 * from the Entity to its parent.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param entity - TypeORM Entity that will be batched.
 * @param config - Configuration parameters for the batch function query. 
 */
export async function batchOneToMany<C extends typeof BaseEntity, T extends BaseEntity>(
  ids: readonly string[],
  entity: C,
  batchConfig: IBatchOneToManyConfig<T> = {},
): Promise<T[][]> {
  const {
    entityIdKey = DEFAULT_ENTITY_ID_KEY,
    config = {
      where: { [entityIdKey!]: In(ids as string[]) },
      order: { createdAt: DEFAULT_ORDER_CREATED_BY },
    },
    take,
  } = batchConfig;
  // Setting up the necessary config object properties:
  if (!config.where) { config.where = { [entityIdKey!]: In(ids as string[]) }; }
  if (!config.order) { config.order = { createdAt: DEFAULT_ORDER_CREATED_BY }; }
  if (!config.take && take) { config.take = take(ids); }
  // Fetching entities, using the set entityIdKey parameter (defaults to `id`).
  const entities = await entity.find(config);
  // Entities map that will hold the fetched entities. Each parent ID will be assigned its respective entity.
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
