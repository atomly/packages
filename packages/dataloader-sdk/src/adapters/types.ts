// Types
import DataLoader from 'dataloader';

export interface DataAdapterOptions<T, O> {
  dataLoaderOptions?: DataLoader.Options<string, T>;
  batchFnOptions?: O;
}
