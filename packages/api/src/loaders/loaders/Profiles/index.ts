// Libraries
import { Profiles as ProfilesEntity } from '@beast/beast-entities';

// Types
import { IProfilesLoaders } from './types';

// Dependencies
import { Factory } from '../../factory';

export const Profiles: IProfilesLoaders = {
  Basic: {
    oneLoader: Factory<ProfilesEntity>(ProfilesEntity, { type: 'ONE_TO_ONE' }),
    manyLoader: Factory<ProfilesEntity[]>(ProfilesEntity, { type: 'MANY_TO_ONE' }),
  },
}
