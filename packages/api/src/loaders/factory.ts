// Libraries
import DataLoader from 'dataloader';
import { BaseEntity, entitiesArray } from '@beast/beast-entities';

type Entity = typeof entitiesArray[number]
interface IBase { id: number }

async function batchEntity<T extends BaseEntity & IBase>(ids : readonly string[], Entity: Entity): Promise<T[]> {
  const entities = await Entity.findByIds<T>(ids as string[]);
  const entitiesMap: { [key: string]: T } = {};
  entities.forEach((entity: T) => {
    entitiesMap[entity.id] = entity;
  });
  return ids.map(id => entitiesMap[id]);
}

export function factory<T extends BaseEntity & IBase>(
  Entity: Entity,
  batchFunction?: DataLoader.BatchLoadFn<string, T>,
): DataLoader<string, T, unknown> {
  if (batchFunction) {
    return new DataLoader<string, T, unknown>(batchFunction);
  }
  return new DataLoader<string, T, unknown>(ids => batchEntity<T>(ids, Entity));
}
