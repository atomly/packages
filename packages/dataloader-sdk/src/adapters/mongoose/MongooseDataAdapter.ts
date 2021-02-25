// Libraries
import DataLoader from 'dataloader';
import {
  Model,
  Document,
} from 'mongoose';

// Dependencies
import { DataAdapter } from '../DataAdapter';
import {
  oneToOneBatchFn,
  oneToManyBatchFn,
} from './helpers';

// Types
import {
  MongooseDataAdapterOptions,
  MongooseDataAdapterBatchLoadFn,
} from './types';

export class MongooseDataAdapter<
  T extends object,
  R,
> implements DataAdapter<Model<Document<T>>, R> {
  static oneToOneBatchFn = oneToOneBatchFn;

  static oneToManyBatchFn = oneToManyBatchFn;

  private dataAdapterOptions: MongooseDataAdapterOptions<T, R>;

  private batchLoadFn: MongooseDataAdapterBatchLoadFn<T, R>;

  constructor(args: {
    batchLoadFn: MongooseDataAdapterBatchLoadFn<T, R>;
    dataAdapterOptions?: MongooseDataAdapterOptions<T, R>;
  }) {
    this.batchLoadFn = args.batchLoadFn;
    this.dataAdapterOptions = args.dataAdapterOptions ?? {};
  }

  /**
   * DataLoader factory function.
   * @param entity - Mongoose entity Model.
   */
  public dataLoaderFactory(entity: Model<Document<T>>): DataLoader<string, R> {
    return new DataLoader<string, R>(
      ids => this.batchLoadFn(ids, entity, this.dataAdapterOptions?.batchFnOptions),
      this.dataAdapterOptions?.dataLoaderOptions,
    );
  }
}
