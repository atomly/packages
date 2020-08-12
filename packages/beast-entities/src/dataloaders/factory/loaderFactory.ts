// Libraries
import DataLoader from 'dataloader';

// Types
import { Entity } from '../../entities';
import {
  IBatchOneToOneConfig,
  IBatchOneToManyConfig,
  IBatchEfficientOneToManyConfig,
} from '../batch';
import {
  IDataLoaderOneToOneOptions,
  IDataLoaderOneToManyOptions,
  IDataLoaderEfficientOneToManyOptions,
} from './types';

// Dependencies
import {
  batchOneToMany,
  batchOneToOne,
  efficientBatchOneToMany,
} from '../batch';

export function oneToOneFactory<T extends Entity>(
  entity: T,
  batchConfig?: IBatchOneToOneConfig<T>,
  dataLoaderOptions?: IDataLoaderOneToOneOptions<T>,
): DataLoader<string, T, unknown> {
  if (batchConfig?.batchFunction) {
    return new DataLoader<string, T, unknown>(
      batchConfig.batchFunction,
      dataLoaderOptions,
    );
  }
  return new DataLoader<string, T, unknown>(
    ids => batchOneToOne<T>(ids, entity, batchConfig),
    dataLoaderOptions,
  );
}

export function oneToManyFactory<T extends Entity>(
  entity: T,
  batchConfig?: IBatchOneToManyConfig<T>,
  dataLoaderOptions?: IDataLoaderOneToManyOptions<T>,
): DataLoader<string, T[], unknown> {
  if (batchConfig?.batchFunction) {
    return new DataLoader<string, T[], unknown>(
      batchConfig.batchFunction,
      dataLoaderOptions,
    );
  }
  return new DataLoader<string, T[], unknown>(
    ids => batchOneToMany<T>(ids, entity, batchConfig),
    dataLoaderOptions,
  );
}

export function limitedOneToManyFactory<T extends Entity>(
  entity: T,
  batchConfig?: IBatchEfficientOneToManyConfig,
  dataLoaderOptions?: IDataLoaderEfficientOneToManyOptions<T>,
): DataLoader<string, T[], unknown> {
  return new DataLoader<string, T[], unknown>(
    ids => efficientBatchOneToMany<T>(ids, entity, batchConfig),
    dataLoaderOptions,
  );
}
