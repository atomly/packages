import { Entity } from "../../entities";
import { ICacheMaps, IDataLoaders, IUpdates, IDeletes, IClears } from "../types";
import { IBatchOneToOneConfig, IBatchOneToManyConfig, IBatchEfficientOneToManyConfig } from '../batch';
import { IDataLoaderOneToOneOptions, IDataLoaderOneToManyOptions, IDataLoaderEfficientOneToManyOptions } from './types';

// For some reason, string | number types adhere to any enum.
// This type helps in making the intentions of the EntityLoadersFactory' E generic
// being enums more explicit.
export type TEnum = string | number;

export interface IEntityReferenceIdKeysParams<T extends Entity> {
  entityIdKey: string
  loadOneConfig?: {
    batchConfig: Omit<IBatchOneToOneConfig<T>, 'entityIdKey'>
    dataLoaderOptions: Omit<IDataLoaderOneToOneOptions<T>, 'cacheMap'>
  }
  loadManyConfig?: {
    batchConfig: Omit<IBatchOneToManyConfig<T>, 'entityIdKey'>
    dataLoaderOptions: Omit<IDataLoaderOneToManyOptions<T>, 'cacheMap'>
  }
  manyLimitedConfig?: {
    batchConfig: Omit<IBatchEfficientOneToManyConfig, 'entityIdKey'>
    dataLoaderOptions: Omit<IDataLoaderEfficientOneToManyOptions<T>, 'cacheMap'>
  }
}

export interface IEntityReferenceIdKeysConfig<T extends Entity> {
  entityIdKey: string
  loadOneConfig: {
    batchConfig: IBatchOneToOneConfig<T>
    dataLoaderOptions: IDataLoaderOneToOneOptions<T>
  }
  loadManyConfig: {
    batchConfig: IBatchOneToManyConfig<T>
    dataLoaderOptions: IDataLoaderOneToManyOptions<T>
  }
  manyLimitedConfig: {
    batchConfig: IBatchEfficientOneToManyConfig
    dataLoaderOptions: IDataLoaderEfficientOneToManyOptions<T>
  }
}

export interface EntityLoadersFactory<T extends Entity, E extends TEnum> {
  by: {
    [key in E]: {
      cacheMap: ICacheMaps<T>
      dataLoader: IDataLoaders<T>
      update: IUpdates<T>
      clear: IClears
      delete: IDeletes
    }
  }
  // cacheMapsBy: { [key in E]: ICacheMap<T>; }
  // loadersBy: { [key in E]: ILoaders<T>; }
  // deleteBy: { [key in E]: (key: string) => Promise<void>; }
  // update(entityReferenceIdKey: E, key: string): Promise<void>
  // delete(entityReferenceIdKey: E, key: string): Promise<void>
  // clear(): void;
}
