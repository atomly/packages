
// Types
import DataLoader from 'dataloader';
import { Profiles } from '@beast/beast-entities';
import { ILoaders } from '../../types';

export interface IProfilesLoaders extends ILoaders<Profiles> {
  Basic: {
    oneLoader: DataLoader<string, Profiles>,
    manyLoader: DataLoader<string, Profiles[]>,
  },
}
