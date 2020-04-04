// Types
import { Entity } from '../types';

export interface IEfficientBatchConfig {
  Entity: Entity
  partitionEntityKey?: 'id' | string
  orderEntityKey?: 'createdAt' | 'updatedAt'
  orderBy?: 'ASC' | 'DESC'
  entitiesPerId?: number
}
