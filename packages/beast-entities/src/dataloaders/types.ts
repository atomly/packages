import DataLoader, { CacheMap } from 'dataloader';
import { Entity } from '../entities';

export interface ICacheMaps<T extends Entity> {
  one: CacheMap<string, Promise<T>>
  many: CacheMap<string, Promise<T[]>>
  manyLimited: CacheMap<string, Promise<T[]>>
}

export interface IDataLoaders<T extends Entity> {
  one: DataLoader<string, T>
  many: DataLoader<string, T[]>
  manyLimited: DataLoader<string, T[]>
}

export interface IUpdates<T extends Entity> {
  one: (key: string) => Promise<T>
  many: (key: string) => Promise<T[]>
  manyLimited: (key: string) => Promise<T[]>
}

export interface IClears {
  one: (key?: string) => void
  many: (key?: string) => void
  manyLimited: (key?: string) => void
}

export interface IDeletes {
  one: (key: string) => void
  many: (key: string) => void
  manyLimited: (key: string) => void
}

// export interface ICacheMapsBy<T extends Entity> {
//   [key: string]: {
//     oneToOne: CacheMap<string, T>
//     oneToMany: CacheMap<string, T[]>
//     efficientOneToMany: CacheMap<string, T[]>
//   }
// }
