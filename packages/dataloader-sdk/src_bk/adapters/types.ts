import DataLoader from 'dataloader';

export interface IDefaultBatchFunctionConfig {
  entityIdKey?: 'id' | string;
}

export type IBatchFunctionOneToOneConfig = IDefaultBatchFunctionConfig;

export interface IBatchFunctionOneToManyConfig extends IDefaultBatchFunctionConfig {
  take?(ids: readonly string[]): number;
}

export interface IBatchFunctionLimitedOneToManyConfig<T> extends IDefaultBatchFunctionConfig {
  entitiesPerId?: number;
  orderEntityKey?: keyof T;
  orderBy?: 'ASC' | 'DESC';
}

export interface DataAdapterOptions<T> {
  oneToOneConfig?: {
    batchFunctionConfig?: IBatchFunctionOneToOneConfig
    dataLoaderOptions?: DataLoader.Options<string, T>
  }
  oneToManyConfig?: {
    batchFunctionConfig?: IBatchFunctionOneToManyConfig
    dataLoaderOptions?: DataLoader.Options<string, T[]>
  }
  oneToManyLimitedConfig?: {
    batchFunctionConfig?: IBatchFunctionLimitedOneToManyConfig<T>
    dataLoaderOptions?: DataLoader.Options<string, T[]>
  }
}
