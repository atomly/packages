// Dependencies
import { In } from '@beast/beast-entities';

// Types
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Entity,
  IBatchOne,
} from '../types';

/**
 * Batch function for a DataLoader structured for a One to One relation
 * from the Entity to its parent.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param Entity - TypeORM Entity that will be batched.
 * @param idsKey - Custom ID unique key identifier instead of the base Entity 'id', e.g. 'userId'.
 */
export async function batchOneToOne<T>(
  ids : readonly string[],
  Entity: Entity,
  { idsKey = 'id', config = {} }: IBatchOne<Entity> = {},
): Promise<T[]> {
  // Fetching entities, if the custom idsKey exists we will use that one.
  const entities = await Entity.find({
    where: { [idsKey]: In(ids as string[]) },
    order: { createdAt: 'ASC' },
    ...config,
  });
  // Entities map init that will be filled with the fetched entities.
  // Each parent ID will be assigned its respective entity.
  const entitiesMap: { [key: string]: T } = {};
  // Key identifier of the entity.
  const key = idsKey as keyof typeof entities[number] ?? 'id';
  // Assigning its respective entitie(s).
  entities.forEach(entity => {
    entitiesMap[entity[key] as unknown as string] = entity as unknown as T;
  });
  return ids.map(id => entitiesMap[id]);
}
