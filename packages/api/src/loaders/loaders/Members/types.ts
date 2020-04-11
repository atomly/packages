
// Types
import DataLoader from 'dataloader';
import { Members } from '@beast/beast-entities';
import { ILoaders } from '../../types';

export interface IMembersLoaders extends ILoaders<Members> {
  Basic: {
    oneLoader: DataLoader<string, Members>
    manyLoader: DataLoader<string, Members[]>
    limittedManyLoader: DataLoader<string, Members[]>
  }
  By: {
    ProfileId: {
      oneLoader: DataLoader<string, Members>,
    }
  }
}
