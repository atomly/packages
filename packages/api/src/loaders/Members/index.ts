// Libraries
import DataLoader from 'dataloader';
import { Members as MembersEntity } from '@beast/beast-entities';

// Types
import { IMembersLoaders } from './types';

// Dependencies
import { Factory } from '../factory';
import { efficientBatchManyToOne } from '../batch/efficientBatchManyToOne';

export function ManyMembersLoader(): DataLoader<string, MembersEntity[], unknown> {
  return Factory<MembersEntity[]>(MembersEntity, { type: 'MANY_TO_ONE' });
}

export function OneMembersLoader(): DataLoader<string, MembersEntity, unknown> {
  return Factory<MembersEntity>(MembersEntity, { type: 'ONE_TO_ONE' });
}

export function OneMembersByProfileIdLoader(): DataLoader<string, MembersEntity, unknown> {
  return Factory<MembersEntity>(
    MembersEntity
    ,
    { type: 'ONE_TO_ONE' },
    { idsKey: 'profileId' },
  );
}

export function LimittedManyMembersLoader(): DataLoader<string, MembersEntity[], unknown> {
  return Factory<MembersEntity[]>(
    MembersEntity ,
    {
      type: 'MANY_TO_ONE',
      batchFunction: (ids) => efficientBatchManyToOne<MembersEntity>(
        ids,
        {
          Entity: MembersEntity,
          partitionEntityKey: 'id',
        },
      ),
    },
  );
}

export const Members: IMembersLoaders = {
  manyLoader: ManyMembersLoader(),
  oneLoader: OneMembersLoader(),
  limittedManyLoader: LimittedManyMembersLoader(),
  oneLoaderByProfileId: OneMembersByProfileIdLoader(),
}
