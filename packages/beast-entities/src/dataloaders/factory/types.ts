// Types
import DataLoader from 'dataloader';
import { Entity } from '../../entities';
import {
  IBatchOneToOneConfig,
  IBatchOneToManyConfig,
} from '../batch';

export interface IDataLoaderOneToOneOptions<T extends Entity> extends DataLoader.Options<string, T> {}

export interface IDataLoaderOneToManyOptions<T extends Entity> extends DataLoader.Options<string, T[]> {}

export interface IDataLoaderEfficientOneToManyOptions<T extends Entity> extends DataLoader.Options<string, T[]> {}

export interface EntityLoaderFactoryParams<T extends Entity> {
  entityIdKey: string
  loadOneTypeormOptions?: IBatchOneToOneConfig<T>
  loadManyTypeormOptions?: IBatchOneToManyConfig<T>
  dataLoaderOptions?: DataLoader.Options<string ,T>
  shouldLoadOne?: boolean
  shouldLoadMany?: boolean
  shouldLoadEfficientMany?: boolean
}
