// Libraries
import DataLoader from 'dataloader';
import { Posts as PostsEntity } from '@beast/beast-entities';

// Types
import { IPostsLoaders } from './types';

// Dependencies
import { Factory } from '../factory';
import { efficientBatchManyToOne } from '../batch/efficientBatchManyToOne';

export function ManyPostsLoader(): DataLoader<string, PostsEntity[], unknown> {
  return Factory<PostsEntity[]>(PostsEntity, { type: 'MANY_TO_ONE' });
}

export function OnePostsLoader(): DataLoader<string, PostsEntity, unknown> {
  return Factory<PostsEntity>(PostsEntity, { type: 'ONE_TO_ONE' });
}

export function LimittedManyPostsLoader(): DataLoader<string, PostsEntity[], unknown> {
  return Factory<PostsEntity[]>(
    PostsEntity ,
    {
      type: 'MANY_TO_ONE',
      batchFunction: (ids) => efficientBatchManyToOne<PostsEntity>(
        ids,
        {
          Entity: PostsEntity,
          partitionEntityKey: 'memberId',
        },
      ),
    },
  );
}

export const Posts: IPostsLoaders = {
  manyLoader: ManyPostsLoader(),
  oneLoader: OnePostsLoader(),
  limittedManyLoader: LimittedManyPostsLoader(),
}
