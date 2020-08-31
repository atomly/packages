import { BaseEntity } from '../../entities'; // TODO: Use a TypeORM adapter for this.
import { ICacheMaps, IDataLoaders, ILoaders, IPrimers, IUpdaters, IClearers, IDeleters } from "../types";
import { IBatchOneToOneConfig, IBatchOneToManyConfig, IBatchEfficientOneToManyConfig } from '../batch';
import { IDataLoaderOneToOneOptions, IDataLoaderOneToManyOptions, IDataLoaderEfficientOneToManyOptions } from './types';

// For some reason, string | number types adhere to any enum.
// This type helps in making the intentions of the EntityLoadersFactory' E generic
// being enums more explicit.
export type TEnum = string | number;

export interface IEntityReferenceIdKeysParams<T extends BaseEntity> {
  entityIdKey: string
  loadOneConfig?: {
    batchConfig?: Omit<IBatchOneToOneConfig<T>, 'entityIdKey'>
    dataLoaderOptions?: Omit<IDataLoaderOneToOneOptions<T>, 'cacheMap'>
  }
  loadManyConfig?: {
    batchConfig?: Omit<IBatchOneToManyConfig<T>, 'entityIdKey'>
    dataLoaderOptions?: Omit<IDataLoaderOneToManyOptions<T>, 'cacheMap'>
  }
  manyLimitedConfig?: {
    batchConfig?: Omit<IBatchEfficientOneToManyConfig, 'entityIdKey'>
    dataLoaderOptions?: Omit<IDataLoaderEfficientOneToManyOptions<T>, 'cacheMap'>
  }
}

export interface IEntityReferenceIdKeysConfig<T extends BaseEntity> {
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

export interface EntityLoadersFactory<T extends BaseEntity, E extends TEnum> {
  _by: {
    [key in E]: {
      cacheMap: ICacheMaps<T>
      dataLoader: IDataLoaders<T>
    }
  }
  by: {
    [key in E]: {
      load: ILoaders<T>
      prime: IPrimers<T>
      update: IUpdaters<T>
      clear: IClearers
      delete: IDeleters
    }
  }
}
