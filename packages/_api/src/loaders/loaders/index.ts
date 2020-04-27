// Dependencies
import { Members } from './Members';
import { Posts } from './Posts';
import { Profiles } from './Profiles';
import { Teams } from './Teams';
import { Users } from './Users';

// Types
import { IEntityLoaders } from './types';

export const loaders: IEntityLoaders = {
  Members,
  Posts,
  Profiles,
  Teams,
  Users,
};
