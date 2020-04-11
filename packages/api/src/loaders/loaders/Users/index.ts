// Libraries
import { Users as UsersEntity } from '@beast/beast-entities';

// Types
import { IUsersLoaders } from './types';

// Dependencies
import { Factory } from '../../factory';

export const Users: IUsersLoaders = {
  Basic: {
    oneLoader: Factory<UsersEntity>(UsersEntity, { type: 'ONE_TO_ONE' }),
    manyLoader: Factory<UsersEntity[]>(UsersEntity, { type: 'MANY_TO_ONE' }),
  },
}
