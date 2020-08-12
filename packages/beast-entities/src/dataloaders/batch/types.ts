// Types
import DataLoader from 'dataloader';
import { FindManyOptions } from 'typeorm';
import { Entity } from '../../entities';

type TFindManyConfig<T extends Entity> = Pick<FindManyOptions<T>, 'where'|'take'|'skip'|'cache'|'join'|'lock'|'relations'|'loadEagerRelations'|'loadRelationIds'>;

interface ITypeORMConfig<T extends Entity> extends TFindManyConfig<T> {
  order: {
    id?: "ASC" | "DESC" | 1 | -1;
    createdAt?: "ASC" | "DESC" | 1 | -1;
    updatedAt?: "ASC" | "DESC" | 1 | -1;
  }
}

interface IDefaultBatchConfig {
  entityIdKey?: 'id' | string
}

export interface IBatchOneToOneConfig<T extends Entity> extends IDefaultBatchConfig {
  config?: ITypeORMConfig<T>
  batchFunction?: DataLoader.BatchLoadFn<string, T>
}

export interface IBatchOneToManyConfig<T extends Entity> extends IDefaultBatchConfig {
  config?: ITypeORMConfig<T>
  batchFunction?: DataLoader.BatchLoadFn<string, T[]>
  take?(ids: readonly string[]): number
}

export interface IBatchEfficientOneToManyConfig extends IDefaultBatchConfig {
  config?: {
    orderEntityKey: 'createdAt' | 'updatedAt'
    orderBy: 'ASC' | 'DESC'
    entitiesPerId: number
  }
}
