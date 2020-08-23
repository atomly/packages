// Types
import DataLoader from 'dataloader';
import { BaseEntity } from '../../entities'; // TODO: Use a TypeORM adapter for this.
import {
  IBatchOneToOneConfig,
  IBatchOneToManyConfig,
} from '../batch';

export interface IDataLoaderOneToOneOptions<T extends BaseEntity> extends DataLoader.Options<string, T> {}

export interface IDataLoaderOneToManyOptions<T extends BaseEntity> extends DataLoader.Options<string, T[]> {}

export interface IDataLoaderEfficientOneToManyOptions<T extends BaseEntity> extends DataLoader.Options<string, T[]> {}

export interface EntityLoaderFactoryParams<T extends BaseEntity> {
  entityIdKey: string
  loadOneTypeormOptions?: IBatchOneToOneConfig<T>
  loadManyTypeormOptions?: IBatchOneToManyConfig<T>
  dataLoaderOptions?: DataLoader.Options<string ,T>
  shouldLoadOne?: boolean
  shouldLoadMany?: boolean
  shouldLoadEfficientMany?: boolean
}
