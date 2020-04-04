
// Libraries
import DataLoader from 'dataloader';
import { Members } from '@beast/beast-entities';

// Types
import { ILoaders } from '../types';

export interface IMembersLoaders extends ILoaders<Members> {
  limittedManyLoader: DataLoader<string, Members[], unknown>
  oneLoaderByProfileId: DataLoader<string, Members, unknown>
}
