// Libraries
import DataLoader from 'dataloader';

// Types
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Entity,
  TBatchConfig,
  IFactoryConfig,
  IBatchFunctionConfig,
  IBatchTypeConfig,
  IBatchMany,
  IBatchOne,
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
  batchConfig?: TBatchConfig<T>,
  factoryConfig?: IFactoryConfig<T>,
  ): DataLoader<string, T, unknown> {
  if (batchConfig) {
    if (typeGuard<IBatchFunctionConfig<T>>(batchConfig, 'batchFunction')) {
      return new DataLoader<string, T, unknown>(batchConfig.batchFunction);
    } else if (typeGuard<IBatchTypeConfig>(batchConfig, 'type')) {
      switch (batchConfig.type) {
        case 'ONE_TO_ONE':
          return new DataLoader<string, T, unknown>(
            ids => batchOneToOne<T>(ids, Entity, factoryConfig?.typeOrmOptions as IBatchOne<T>),
            factoryConfig?.dataLoaderOptions,
          );
        case 'MANY_TO_ONE':
          return new DataLoader<string, T, unknown>(
            ids => batchManyToOne<T>(ids, Entity, factoryConfig?.typeOrmOptions as IBatchMany<T>),
            factoryConfig?.dataLoaderOptions,
          );
      }
    }
  }
  return new DataLoader<string, T, unknown>(
    ids => batchOneToOne<T>(ids, Entity, factoryConfig?.typeOrmOptions as IBatchOne<T>),
    factoryConfig?.dataLoaderOptions,
    );
}
