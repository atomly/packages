// Libraries
import DataLoader from 'dataloader';
import { BaseEntity } from 'typeorm';

// Dependencies
import { DataAdapter } from '../DataAdapter';
import {
  batchFunctionOneToOne,
  batchFunctionOneToMany,
  batchFunctionLimitedOneToMany,
} from './helpers';

// Types
import { TypeORMDataAdapterOptions } from './types';

export class TypeORMDataAdapter<
  T extends BaseEntity,
  K extends new() => T,
  O extends TypeORMDataAdapterOptions<T> = TypeORMDataAdapterOptions<T>
> implements DataAdapter<T, K, O> {
  public oneToOneBatchFunction?: DataLoader.BatchLoadFn<string, T>;

  public oneToManyBatchFunction?: DataLoader.BatchLoadFn<string, T[]>;

  constructor(args?: {
    oneToOneBatchFunction?: DataLoader.BatchLoadFn<string, T>;
    oneToManyBatchFunction?: DataLoader.BatchLoadFn<string, T[]>;
  }) {
    if (args) {
      this.oneToOneBatchFunction = args.oneToOneBatchFunction;
      this.oneToManyBatchFunction = args.oneToManyBatchFunction;
    }
  }

  public oneToOneDataLoaderFactory(entity: K, options: O['oneToOneConfig']): DataLoader<string, T, unknown> {
    if (this.oneToOneBatchFunction) {
      return new DataLoader<string, T, unknown>(
        this.oneToOneBatchFunction,
        options?.dataLoaderOptions,
      );
    }
    return new DataLoader<string, T, unknown>(
      ids => batchFunctionOneToOne<T, K>(ids, entity, options?.batchFunctionConfig),
      options?.dataLoaderOptions,
    );
  }

  public oneToManyDataLoaderFactory(entity: K, options: O['oneToManyConfig']): DataLoader<string, T[], unknown> {
    if (this.oneToManyBatchFunction) {
      return new DataLoader<string, T[], unknown>(
        this.oneToManyBatchFunction,
        options?.dataLoaderOptions,
      );
    }
    return new DataLoader<string, T[], unknown>(
      ids => batchFunctionOneToMany<T, K>(ids, entity, options?.batchFunctionConfig),
      options?.dataLoaderOptions,
    );
  }

  public oneToManyLimitedDataLoaderFactory(entity: K, options: O['oneToManyLimitedConfig']): DataLoader<string, T[], unknown> {
    return new DataLoader<string, T[], unknown>(
      ids => batchFunctionLimitedOneToMany<T, K>(ids, entity, options?.batchFunctionConfig),
      options?.dataLoaderOptions,
    );
  }
}
