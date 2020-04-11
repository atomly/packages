
// Types
import DataLoader from 'dataloader';
import { Users } from '@beast/beast-entities';
import { ILoaders } from '../../types';

export interface IUsersLoaders extends ILoaders<Users> {
  Basic: {
    oneLoader: DataLoader<string, Users>,
    manyLoader: DataLoader<string, Users[]>,
  },
}
