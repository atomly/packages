
// Libraries
import DataLoader from 'dataloader';
import { Posts } from '@beast/beast-entities';

// Types
import { ILoaders } from '../types';

export interface IPostsLoaders extends ILoaders<Posts> {
  manyLoaderByMemberIds: DataLoader<string, Posts[], unknown>
}
