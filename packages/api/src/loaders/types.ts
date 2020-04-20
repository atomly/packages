// Types
import DataLoader from 'dataloader';
import { entitiesArray, FindManyOptions } from '@beast/beast-entities';

export type Entity = typeof entitiesArray[number]

//
// LOADERS
//

interface IBasicLoaders<T> {
  oneLoader?: DataLoader<string, T>
  manyLoader?: DataLoader<string, T[]>
  limittedManyLoader?: DataLoader<string, T[]>
}

export interface ILoaders<T> {
  Basic: IBasicLoaders<T>
  By?: Record<string, IBasicLoaders<T>>
  // TODO: Add clearAll
  clearAll(): void
}

//
// BATCH FACTORY
//

type TFind<T> = Pick<FindManyOptions<T>, 'order'|'skip'|'where'|'cache'|'join'|'lock'|'relations'|'loadEagerRelations'|'loadRelationIds'>;

interface IConfigOne<T> extends TFind<T> {
  take?: Pick<FindManyOptions<T>, 'take'>['take']
}

interface IConfigMany<T> extends TFind<T> {
  take?(ids: readonly string[]): number
}

interface IBaseConfig {
  idsKey?: string
}

export interface IBatchFunctionConfig<T> {
  batchFunction: DataLoader.BatchLoadFn<string, T>
}

export interface IBatchTypeConfig {
  type: 'ONE_TO_ONE' | 'MANY_TO_ONE'
}

export type TBatchConfig<T> = IBatchFunctionConfig<T> | IBatchTypeConfig;

export interface IBatchOne<T> extends IBaseConfig {
  config?: IConfigOne<T>
}

export interface IBatchMany<T> extends IBaseConfig {
  config?: IConfigMany<T>
}

export interface IFactoryConfig<T> {
  typeOrmOptions?: IBatchOne<T> | IBatchMany<T>
  dataLoaderOptions?: DataLoader.Options<string ,T>
}
