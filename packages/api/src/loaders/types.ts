// Types
import DataLoader from 'dataloader';
import { entitiesArray, FindManyOptions } from '@beast/beast-entities';

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

type TFind<T> = Pick<FindManyOptions<T>, 'order'|'skip'|'where'|'cache'|'join'|'lock'|'relations'|'loadEagerRelations'|'loadRelationIds'>;

interface IConfigMany<T> extends TFind<T> {
  take?(ids: readonly string[]): number
}

interface IConfigOne<T> extends TFind<T> {
  take?: Pick<FindManyOptions<T>, 'take'>['take']
}

export interface IBatchMany<T> {
  idsKey?: string
  config?: IConfigMany<T>
}

export interface IBatchOne<T> {
  idsKey?: string
  config?: IConfigOne<T>
}
