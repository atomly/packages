// Libraries
import DataLoader from 'dataloader';
import { Teams as TeamsEntity } from '@beast/beast-entities';

// Types
import { ITeamsLoaders } from './types';

// Dependencies
import { Factory } from '../factory';
import { efficientBatchManyToOne } from '../batch/efficientBatchManyToOne';

export function ManyTeamsLoader(): DataLoader<string, TeamsEntity[], unknown> {
  return Factory<TeamsEntity[]>(TeamsEntity, { type: 'MANY_TO_ONE' });
}

export function OneTeamsLoader(): DataLoader<string, TeamsEntity, unknown> {
  return Factory<TeamsEntity>(TeamsEntity, { type: 'ONE_TO_ONE' });
}

export function LimittedManyTeamsLoader(): DataLoader<string, TeamsEntity[], unknown> {
  return Factory<TeamsEntity[]>(
    TeamsEntity ,
    {
      type: 'MANY_TO_ONE',
      batchFunction: (ids) => efficientBatchManyToOne<TeamsEntity>(
        ids,
        {
          Entity: TeamsEntity,
          partitionEntityKey: 'id',
        },
      ),
    },
  );
}

export const Teams: ITeamsLoaders = {
  manyLoader: ManyTeamsLoader(),
  oneLoader: OneTeamsLoader(),
  limittedManyLoader: LimittedManyTeamsLoader(),
}
