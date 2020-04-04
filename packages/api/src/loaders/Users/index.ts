// Libraries
import DataLoader from 'dataloader';
import { Users as UsersEntity } from '@beast/beast-entities';

// Types
import { ILoaders } from '../types';

// Dependencies
import { Factory } from '../factory';

export function ManyUsersLoader(): DataLoader<string, UsersEntity[], unknown> {
  return Factory<UsersEntity[]>(UsersEntity, { type: 'MANY_TO_ONE' });
}

export function OneUsersLoader(): DataLoader<string, UsersEntity, unknown> {
  return Factory<UsersEntity>(UsersEntity, { type: 'ONE_TO_ONE' });
}

export const Users: ILoaders<UsersEntity> = {
  manyLoader: ManyUsersLoader(),
  oneLoader: OneUsersLoader(),
}
