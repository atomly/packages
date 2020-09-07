// Libraries
import DataLoader from 'dataloader';

// Types
import { DataAdapterOptions } from './types';

export interface DataAdapter<
  T,
  K extends new() => T,
  O extends DataAdapterOptions<T> = DataAdapterOptions<T>
> {
  oneToOneDataLoaderFactory(entity: K, dataAdapterOptions: O['oneToOneConfig'],...args: unknown[]): DataLoader<string, T, unknown>

  oneToManyDataLoaderFactory(entity: K, dataAdapterOptions: O['oneToManyConfig'], ...args: unknown[]): DataLoader<string, T[], unknown>

  oneToManyLimitedDataLoaderFactory(entity: K, dataAdapterOptions: O['oneToManyLimitedConfig'], ...args: unknown[]): DataLoader<string, T[], unknown>
}
