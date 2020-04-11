
// Libraries
import DataLoader from 'dataloader';
import { Posts } from '@beast/beast-entities/src';
import { ILoaders } from '../../types';

export interface IPostsLoaders extends ILoaders<Posts> {
  Basic: {
    oneLoader: DataLoader<string, Posts>,
    manyLoader: DataLoader<string, Posts[]>,
  },
  By: {
    MemberId: {
      limittedManyLoader: DataLoader<string, Posts[]>,
    }
  },
}
