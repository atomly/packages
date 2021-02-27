// Types
import DataLoader from 'dataloader';

export interface DataAdapterBatchFnOptions {
  entityKey: string | number;
}

export interface DataAdapterOptions<T, O> {
  dataLoaderOptions?: Omit<DataLoader.Options<string | number, T>, 'cacheMap'>;
  batchFnOptions?: DataAdapterBatchFnOptions & O;
}
