// Libraries
import DataLoader from 'dataloader';

// Dependencies
import { In } from '@beast/beast-entities';

// Types
import {
  IFactoryBatchFunctionConfig,
  IFactoryTypeConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Entity,
} from './types';

function typeGuard<I>(object: unknown, member: string): object is I {
  if (typeof object === 'object' && object) {
    return member in object;
  }
  return false;
}

/**
 * Batch function for a DataLoader structured for a One to One relation
 * from the Entity to its parent.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param Entity - TypeORM Entity that will be batched.
 * @param idsKey - Custom ID unique key identifier instead of the base Entity 'id', e.g. 'userId'.
 */
async function batchOneToOne<T>(
  ids : readonly string[],
  Entity: Entity,
  idsKey?: string,
): Promise<T[]> {
  // Fetching entities, if the custom idsKey exists we will use that one.
  const entities = idsKey ?
    await Entity.find({
      where: { [idsKey]: In(ids as string[]) },
      order: { createdAt: 'ASC' },
    }) :
    await Entity.findByIds(ids as string[], { order : { createdAt: 'ASC' }});
  // Entities map init that will be filled with the fetched entities.
  // Each parent ID will be assigned its respective entity.
  const entitiesMap: { [key: string]: T } = {};
  const key = (
    idsKey as keyof typeof entities[number] ?? 'id'
  );
  // Assigning its respective entitie(s).
  entities.forEach(entity => {
    entitiesMap[entity[key] as unknown as string] = entity as unknown as T;
  });
  return ids.map(id => entitiesMap[id]);
}

/**
 * Batch function for a DataLoader structured for a Many to One relation
 * from the Entity to its parent.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param Entity - TypeORM Entity that will be batched.
 * @param idsKey - Custom ID unique key identifier instead of the base Entity 'id', e.g. 'userId'.
 */
async function batchManyToOne<T>(
  ids : readonly string[],
  Entity: Entity,
  idsKey?: string,
): Promise<T[]> {
  // Fetching entities, if the custom idsKey exists we will use that one.
  const entities = idsKey ?
    await Entity.find({
      where: { [idsKey!]: In(ids as string[]) },
      order: { createdAt: 'ASC' },
    }) :
    await Entity.findByIds(ids as string[], { order : { createdAt: 'ASC' }});
  // Entities map init that will be filled with the fetched entities.
  // Each parent ID will be assigned its respective entitie(s).
  const entitiesMap: { [key: string]: T } = {};
  const key = (
    idsKey as keyof typeof entities[number] ?? 'id'
  );
  // Assigning its respective entitie(s).
  entities.forEach(entity => {
    if (Array.isArray(entitiesMap[entity[key] as unknown as string])) {
      (entitiesMap[entity[key] as unknown as string] as unknown as Array<unknown>).push(entity);
    } else {
      entitiesMap[entity[key] as unknown as string] = [entity] as unknown as T;
    }
  });
  return ids.map(id => entitiesMap[id]);
}

export function Factory<T>(
  Entity: Entity,
  config?: IFactoryBatchFunctionConfig<T> | IFactoryTypeConfig,
  idsKey?: string,
): DataLoader<string, T, unknown> {
  if (config) {
    if (typeGuard<IFactoryBatchFunctionConfig<T>>(config, 'batchFunction')) {
      return new DataLoader<string, T, unknown>(config.batchFunction);
    } else if (typeGuard<IFactoryTypeConfig>(config, 'type')) {
      switch (config.type) {
        case 'ONE_TO_ONE':
          return new DataLoader<string, T, unknown>(
            ids => batchOneToOne<T>(ids, Entity, idsKey),
          );
        case 'MANY_TO_ONE':
          return new DataLoader<string, T, unknown>(
            ids => batchManyToOne<T>(ids, Entity, idsKey),
          );
      }
    }
  }
  return new DataLoader<string, T, unknown>(
    ids => batchOneToOne<T>(ids, Entity, idsKey),
  );
}
