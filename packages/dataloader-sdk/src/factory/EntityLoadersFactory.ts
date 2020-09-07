// Types
import {
  ICacheMaps,
  IDataLoaders,
  ILoaders,
  IPrimers,
  IUpdaters,
  IClearers,
  IDeleters,
} from '../types';

// For some reason, string | number types adhere to any enum.
// This type helps in making the intentions of the EntityLoadersFactory' E generic
// being enums more explicit.
export type TEnum = string | number;

export interface EntityLoadersFactory<T, E extends TEnum> {
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
