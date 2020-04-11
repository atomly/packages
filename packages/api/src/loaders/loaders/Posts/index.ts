// Libraries
import { Posts as PostsEntity } from '@beast/beast-entities';

// Types
import { IPostsLoaders } from './types';

// Dependencies
import { Factory } from '../../factory';
import { efficientBatchManyToOne } from '../../batch';

export const Posts: IPostsLoaders = {
  Basic: {
    oneLoader: Factory<PostsEntity>(PostsEntity, { type: 'ONE_TO_ONE' }),
    manyLoader: Factory<PostsEntity[]>(PostsEntity, { type: 'MANY_TO_ONE' }),
  },
  By: {
    MemberId: {
      limittedManyLoader: Factory<PostsEntity[]>(
        PostsEntity,
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
        {
          dataLoaderOptions: {
            cache: false,
          },
        },
      ),
    },
  },
}
