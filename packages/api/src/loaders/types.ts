// Types
import DataLoader from 'dataloader';
import { entitiesArray } from '@beast/beast-entities';

export interface IFactoryBatchFunctionConfig<T> {
  batchFunction: DataLoader.BatchLoadFn<string, T>
}

export interface IFactoryTypeConfig {
  type: 'ONE_TO_ONE' | 'MANY_TO_ONE'
}

export type Entity = typeof entitiesArray[number]

export interface ILoaders<T> {
  manyLoader: DataLoader<string, T[], unknown>
  oneLoader: DataLoader<string, T, unknown>
}
