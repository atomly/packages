// Libraries
import DataLoader from 'dataloader';
import { Profiles as ProfilesEntity } from '@beast/beast-entities';

// Types
import { IProfilesLoaders } from './types';

// Dependencies
import { Factory } from '../factory';

export function ManyProfilesLoader(): DataLoader<string, ProfilesEntity[], unknown> {
  return Factory<ProfilesEntity[]>(ProfilesEntity, { type: 'MANY_TO_ONE' });
}

export function OneProfilesLoader(): DataLoader<string, ProfilesEntity, unknown> {
  return Factory<ProfilesEntity>(ProfilesEntity, { type: 'ONE_TO_ONE' });
}

export const Profiles: IProfilesLoaders = {
  manyLoader: ManyProfilesLoader(),
  oneLoader: OneProfilesLoader(),
}
