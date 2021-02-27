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
  R extends object | Array<unknown>,
> implements DataAdapter<Model<T & Document>, R> {
  static oneToOneBatchFn = oneToOneBatchFn;

  static oneToManyBatchFn = oneToManyBatchFn;

  public entityManager: Model<T & Document>;

  private dataAdapterOptions: MongooseDataAdapterOptions<T, R>;

  private batchLoadFn: MongooseDataAdapterBatchLoadFn<T, R>;

  constructor(args: {
    entityManager: Model<T & Document>;
    batchLoadFn: MongooseDataAdapterBatchLoadFn<T, R>;
    dataAdapterOptions?: MongooseDataAdapterOptions<T, R>;
  }) {
    this.entityManager = args.entityManager ;
    this.batchLoadFn = args.batchLoadFn;
    this.dataAdapterOptions = args.dataAdapterOptions ?? {};
  }

  /**
   * DataLoader factory function.
   * @param options - DataLoader options.
   */
  public generateDataLoader(entityKey: string | number, options: DataLoader.Options<string | number, R>): DataLoader<string | number, R> {
    return new DataLoader<string | number, R>(
      ids => this.batchLoadFn(
        ids, this.entityManager,
        Object.assign(
          {},
          this.dataAdapterOptions?.batchFnOptions ?? {},
          { entityKey },
        ),
      ),
      Object.assign(
        {},
        this.dataAdapterOptions?.dataLoaderOptions ?? {},
        options,
      ),
    );
  }
}
