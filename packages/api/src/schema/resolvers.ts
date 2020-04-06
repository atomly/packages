// Utils
import { composeResolvers } from '@utils/index';

// Types
import { IQueryResolverMap } from './query/types';
import { IUsersResolverMap } from './users/types';
import { IPostResolverMap } from './posts/types';
import { IProfilesResolverMap } from './profiles/types';
import { ITeamsResolverMap } from './teams/types';
import { IMembersResolverMap } from './members/types';

// Resolvers
import queryResolvers from './query';
import userResolvers from './users';
import postResolvers from './posts';
import profileResolvers from './profiles';
import teamResolvers from './teams';
import memberResolvers from './members';

export type IResolverMap = (
  IQueryResolverMap & IUsersResolverMap &
  IPostResolverMap & IProfilesResolverMap &
  ITeamsResolverMap & IMembersResolverMap
);

export const resolvers: IResolverMap = composeResolvers<IResolverMap>(
  queryResolvers,
  userResolvers,
  postResolvers,
  profileResolvers,
  teamResolvers,
  memberResolvers,
);
