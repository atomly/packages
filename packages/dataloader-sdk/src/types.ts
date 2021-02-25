import DataLoader, { CacheMap } from 'dataloader';

export interface EntityLoader<T> {
  cacheMap: CacheMap<string, Promise<T>>;
  dataloader: DataLoader<string, T>;
  loader(key: string): Promise<T>;
  primer(key: string, entity: T): DataLoader<string, T>;
  updater(key: string): Promise<T>;
  clearer(key?: string): Promise<void>;
  deleter(key: string): Promise<void>;
}

//
// OLD
//

// import { DataAdapterOptions } from './adapters';

// export interface IEntityReferenceIdKeysParams<T> {
//   entityIdKey: string
//   loadOneConfig?: {
//     batchConfig?: Omit<IBatchOneToOneConfig<T>, 'entityIdKey'>
//     dataLoaderOptions?: Omit<DataLoader.Options<string, T>, 'cacheMap'>
//   }
//   loadManyConfig?: {
//     batchConfig?: Omit<IBatchOneToManyConfig<T>, 'entityIdKey'>
//     dataLoaderOptions?: Omit<DataLoader.Options<string, T[]>, 'cacheMap'>
//   }
//   manyLimitedConfig?: {
//     batchConfig?: Omit<IBatchLimitedOneToManyConfig<T>, 'entityIdKey'>
//     dataLoaderOptions?: Omit<DataLoader.Options<string, T[]>, 'cacheMap'>
//   }
// }

// export interface IEntityReferenceIdKeysParams<T> {
//   dataAdapterOptions?: DataAdapterOptions<T>
// }

// export interface ICacheMaps<T> {
//   one: CacheMap<string, Promise<T>>;
//   many: CacheMap<string, Promise<T[]>>
//   manyLimited: CacheMap<string, Promise<T[]>>
// }

// export interface IDataLoaders<T> {
//   one: DataLoader<string, T>
//   many: DataLoader<string, T[]>
//   manyLimited: DataLoader<string, T[]>
// }

// export interface ILoaders<T> {
//   one: (key: string) => Promise<T>
//   many: (key: string) => Promise<T[]>
//   manyLimited: (key: string) => Promise<T[]>
// }

// export interface IPrimers<T> {
//   one: (key: string, entity: T) => DataLoader<string, T>
//   many: (key: string, entities: T[]) => DataLoader<string, T[]>
//   manyLimited: (key: string, entities: T[]) => DataLoader<string, T[]>
// }

// export interface IUpdaters<T> {
//   one: (key: string) => Promise<T>
//   many: (key: string) => Promise<T[]>
//   manyLimited: (key: string) => Promise<T[]>
// }

// export interface IClearers {
//   one: (key?: string) => Promise<void>
//   many: (key?: string) => Promise<void>
//   manyLimited: (key?: string) => Promise<void>
// }

// export interface IDeleters {
//   one: (key: string) => Promise<void>
//   many: (key: string) => Promise<void>
//   manyLimited: (key: string) => Promise<void>
// }

// export interface ICacheMapsBy<T> {
//   [key: string]: {
//     oneToOne: CacheMap<string, T>
//     oneToMany: CacheMap<string, T[]>
//     oneToManyLimited: CacheMap<string, T[]>
//   }
// }
