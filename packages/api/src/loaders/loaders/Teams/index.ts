// Libraries
import { Teams as TeamsEntity } from '@beast/beast-entities';

// Types
import { ITeamsLoaders } from './types';

// Dependencies
import { Factory } from '../../factory';
import { efficientBatchManyToOne } from '../../batch';

export const Teams: ITeamsLoaders = {
  Basic: {
    oneLoader: Factory<TeamsEntity>(TeamsEntity, { type: 'ONE_TO_ONE' }),
    manyLoader: Factory<TeamsEntity[]>(TeamsEntity, { type: 'MANY_TO_ONE' }),
    limittedManyLoader: Factory<TeamsEntity[]>(
      TeamsEntity,
      {
        type: 'MANY_TO_ONE',
        batchFunction: ids => efficientBatchManyToOne<TeamsEntity>(
          ids,
          {
            Entity: TeamsEntity,
            partitionEntityKey: 'id',
          },
        ),
      },
    ),
  },
}
