
// Types
import DataLoader from 'dataloader';
import { Teams } from '@beast/beast-entities';
import { ILoaders } from '../../types';

export interface ITeamsLoaders extends ILoaders<Teams> {
  Basic: {
    oneLoader: DataLoader<string, Teams>,
    manyLoader: DataLoader<string, Teams[]>,
    limittedManyLoader: DataLoader<string, Teams[], unknown>
  },
}
