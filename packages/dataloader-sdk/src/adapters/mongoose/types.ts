// Types
import {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
} from 'mongoose';
import { DataAdapterOptions } from '../types';

export type MongooseDataAdapterOptions<T extends object, R = T> = (
  DataAdapterOptions<
    R,
    {
      entityIdKey?: 'id' | string;
      filterQuery?: FilterQuery<T>;
      projectionOptions?: Record<keyof T, -1 | 1>;
      queryOptions?: QueryOptions;
      shouldLean?: boolean;
    }
  >
);

export type MongooseDataAdapterBatchLoadFn<T extends object, R = T> = (
  keys: ReadonlyArray<string>,
  entity: Model<Document<T>>,
  batchFnOptions?: MongooseDataAdapterOptions<T, R>['batchFnOptions'],
) => PromiseLike<ArrayLike<R | Error>>;
