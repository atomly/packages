import DataLoader from 'dataloader';
import { FindManyOptions } from 'typeorm';
import {
  IBatchFunctionOneToOneConfig,
  IBatchFunctionOneToManyConfig,
  IBatchFunctionLimitedOneToManyConfig,
  DataAdapterOptions,
} from '../types';

export type TypeORMFindManyOptions<T> = Pick<FindManyOptions<T>, 'where'|'take'|'skip'|'cache'|'join'|'lock'|'relations'|'loadEagerRelations'|'loadRelationIds'>;

export interface TypeORMQuery<T> extends TypeORMFindManyOptions<T> {
  order: {
    [P in keyof T]?: 'ASC' | 'DESC' | 1 | -1;
  };
  /**
   * `where` query property will NOT work.
   */
  where: Pick<FindManyOptions<T>, 'where'>;
}

export interface TypeORMBatchFunctionOneToOneConfig<T> extends IBatchFunctionOneToOneConfig {
  query?: Partial<TypeORMQuery<T>>;
}

export interface TypeORMBatchFunctionOneToManyConfig<T> extends IBatchFunctionOneToManyConfig {
  query?: Partial<TypeORMQuery<T>>;
}

export type TypeORMBatchFunctionLimitedOneToManyConfig<T> = IBatchFunctionLimitedOneToManyConfig<T>;

export interface TypeORMDataAdapterOptions<T> extends DataAdapterOptions<T> {
  oneToOneConfig?: {
    batchFunctionConfig?: TypeORMBatchFunctionOneToOneConfig<T>
    dataLoaderOptions?: DataLoader.Options<string, T>
  }
  oneToManyConfig?: {
    batchFunctionConfig?: TypeORMBatchFunctionOneToManyConfig<T>
    dataLoaderOptions?: DataLoader.Options<string, T[]>
  }
  oneToManyLimitedConfig?: {
    batchFunctionConfig?: TypeORMBatchFunctionLimitedOneToManyConfig<T>
    dataLoaderOptions?: DataLoader.Options<string, T[]>
  }
}
