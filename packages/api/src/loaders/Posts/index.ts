// Libraries
import DataLoader from 'dataloader';
import { Posts as PostsEntity } from '@beast/beast-entities';

// Types
import { IPostsLoaders } from './types';

// Dependencies
import { Factory } from '../factory';

export function ManyPostsLoader(): DataLoader<string, PostsEntity[], unknown> {
  return Factory<PostsEntity[]>(PostsEntity , { type: 'MANY_TO_ONE'});
}

export function OnePostsLoader(): DataLoader<string, PostsEntity, unknown> {
  return Factory<PostsEntity>(PostsEntity , { type: 'ONE_TO_ONE'});
}

export function ManyPostsByUserIdsLoader(): DataLoader<string, PostsEntity[], unknown> {
  return Factory<PostsEntity[]>(
    PostsEntity ,
    { type: 'MANY_TO_ONE'},
    'userId',
  );
}

export const Posts: IPostsLoaders = {
  manyLoader: ManyPostsLoader(),
  oneLoader: OnePostsLoader(),
  manyLoaderByUserIds: ManyPostsByUserIdsLoader(),
}
