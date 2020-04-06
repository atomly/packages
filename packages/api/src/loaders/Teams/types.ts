
// Libraries
import DataLoader from 'dataloader';
import { Teams } from '@beast/beast-entities';

// Types
import { ILoaders } from '../types';

export interface ITeamsLoaders extends ILoaders<Teams> {
  limittedManyLoader: DataLoader<string, Teams[], unknown>
}
