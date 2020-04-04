// Libraries
import DataLoader from 'dataloader';

// Types
import {
  IFactoryBatchFunctionConfig,
  IFactoryTypeConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Entity,
  IBatchOne,
  IBatchMany,
} from './types';

// Dependencies
import {
  batchManyToOne,
  batchOneToOne,
} from './batch';

function typeGuard<I>(object: unknown, member: string): object is I {
  if (typeof object === 'object' && object) {
    return member in object;
  }
  return false;
}

export function Factory<T>(
  Entity: Entity,
  config?: IFactoryBatchFunctionConfig<T> | IFactoryTypeConfig,
  batchConfig?: IBatchMany<Entity> | IBatchOne<Entity>,
  ): DataLoader<string, T, unknown> {
  if (config) {
    if (typeGuard<IFactoryBatchFunctionConfig<T>>(config, 'batchFunction')) {
      return new DataLoader<string, T, unknown>(config.batchFunction);
    } else if (typeGuard<IFactoryTypeConfig>(config, 'type')) {
      switch (config.type) {
        case 'ONE_TO_ONE':
          return new DataLoader<string, T, unknown>(
            ids => batchOneToOne<T>(ids, Entity, batchConfig as IBatchOne<Entity>),
          );
        case 'MANY_TO_ONE':
          return new DataLoader<string, T, unknown>(
            ids => batchManyToOne<T>(ids, Entity, batchConfig as IBatchMany<Entity>),
          );
      }
    }
  }
  return new DataLoader<string, T, unknown>(
    ids => batchOneToOne<T>(ids, Entity, batchConfig as IBatchOne<Entity>),
  );
}
