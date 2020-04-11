// Libraries
import { Members as MembersEntity } from '@beast/beast-entities';

// Types
import { IMembersLoaders } from './types';

// Dependencies
import { Factory } from '../../factory';
import { efficientBatchManyToOne } from '../../batch';

export const Members: IMembersLoaders = {
  Basic: {
    manyLoader: Factory<MembersEntity[]>(MembersEntity, { type: 'MANY_TO_ONE' }),
    oneLoader: Factory<MembersEntity>(MembersEntity, { type: 'ONE_TO_ONE' }),
    limittedManyLoader: Factory<MembersEntity[]>(
      MembersEntity,
      {
        type: 'MANY_TO_ONE',
        batchFunction: ids => efficientBatchManyToOne<MembersEntity>(
          ids,
          {
            Entity: MembersEntity,
            partitionEntityKey: 'id',
          },
        ),
      },
    ),
  },
  By: {
    ProfileId: {
      oneLoader: Factory<MembersEntity>(
        MembersEntity
        ,
        { type: 'ONE_TO_ONE' },
        {
          typeOrmOptions: {
            idsKey: 'profileId',
          },
          dataLoaderOptions: {
            cache: false,
          },
        },
      ),
    },
  },
}
