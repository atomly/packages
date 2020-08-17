import DataLoader, { CacheMap } from 'dataloader';
import { BaseEntity } from '../entities';

export interface ICacheMaps<T extends typeof BaseEntity> {
  one: CacheMap<string, Promise<T>>
  many: CacheMap<string, Promise<T[]>>
  manyLimited: CacheMap<string, Promise<T[]>>
}

export interface IDataLoaders<T extends typeof BaseEntity> {
  one: DataLoader<string, T>
  many: DataLoader<string, T[]>
  manyLimited: DataLoader<string, T[]>
}

export interface ILoaders<T extends typeof BaseEntity> {
  one: (key: string) => Promise<T>
  many: (key: string) => Promise<T[]>
  manyLimited: (key: string) => Promise<T[]>
}

export interface IPrimers<T extends typeof BaseEntity> {
  one: (key: string, entity: T) => DataLoader<string, T>
  many: (key: string, entities: T[]) => DataLoader<string, T[]>
  manyLimited: (key: string, entities: T[]) => DataLoader<string, T[]>
}

export interface IUpdaters<T extends typeof BaseEntity> {
  one: (key: string) => Promise<T>
  many: (key: string) => Promise<T[]>
  manyLimited: (key: string) => Promise<T[]>
}

export interface IClearers {
  one: (key?: string) => Promise<void>
  many: (key?: string) => Promise<void>
  manyLimited: (key?: string) => Promise<void>
}

export interface IDeleters {
  one: (key: string) => Promise<void>
  many: (key: string) => Promise<void>
  manyLimited: (key: string) => Promise<void>
}

// export interface ICacheMapsBy<T extends typeof BaseEntity> {
//   [key: string]: {
//     oneToOne: CacheMap<string, T>
//     oneToMany: CacheMap<string, T[]>
//     efficientOneToMany: CacheMap<string, T[]>
//   }
// }
