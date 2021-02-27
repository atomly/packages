// Types
import {
  Document,
  FilterQuery,
  Model,
  QueryFindOptions,
} from 'mongoose';
import { DataAdapterOptions } from '../types';

export type MongooseDataAdapterOptions<
  T,
  R extends object | Array<unknown>,
> = (
  DataAdapterOptions<
    R,
    {
      entityKey?: 'id' | string | number;
      filterQuery?: FilterQuery<T>;
      projectionOptions?: Record<keyof T, -1 | 1>;
      queryOptions?: QueryFindOptions;
      shouldLean?: boolean;
    }
  >
);

export type MongooseDataAdapterBatchLoadFn<
  T extends object,
  R extends object | Array<unknown>,
> = (
  keys: ReadonlyArray<string | number>,
  entity: Model<T & Document>,
  batchFnOptions?: MongooseDataAdapterOptions<T, R>['batchFnOptions'],
) => PromiseLike<ArrayLike<R | Error>>;
