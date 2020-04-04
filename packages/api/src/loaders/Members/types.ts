
// Libraries
import DataLoader from 'dataloader';
import { Members } from '@beast/beast-entities';

// Types
import { ILoaders } from '../types';

export interface IMembersLoaders extends ILoaders<Members> {
  manyLoaderByIds: DataLoader<string, Members[], unknown>
}
