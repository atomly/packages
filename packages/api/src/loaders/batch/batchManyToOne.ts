// Dependencies
import { In } from '@beast/beast-entities';

// Types
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Entity,
  IBatchMany,
} from '../types';


/**
 * Batch function for a DataLoader structured for a Many to One relation
 * from the Entity to its parent.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param Entity - TypeORM Entity that will be batched.
 * @param idsKey - Custom ID unique key identifier instead of the base Entity 'id', e.g. 'userId'.
 */
export async function batchManyToOne<T>(
  ids : readonly string[],
  Entity: Entity,
  { idsKey = 'id', config = {} }: IBatchMany<Entity> = {},
): Promise<T[]> {
  const { take, ...rest } = config;
  // Fetching entities, if the custom idsKey exists we will use that one.
  const entities = await Entity.find({
    where: { [idsKey!]: In(ids as string[]) },
    order: { createdAt: 'ASC' },
    take: (take ? take(ids) : undefined),
    ...rest,
  });
  // Entities map init that will be filled with the fetched entities.
  // Each parent ID will be assigned its respective entitie(s).
  const entitiesMap = ids.reduce((map: Record<string, T>, id) => {
    map[id] = [] as unknown as T;
    return map;
  }, {});
  // Key identifier of the entity.
  const key = idsKey as keyof typeof entities[number] ?? 'id';
  // Assigning its respective entitie(s).
  entities.forEach(entity => {
    (entitiesMap[entity[key] as unknown as string] as unknown as Array<unknown>).push(entity);
  });
  return ids.map(id => entitiesMap[id]);
}
