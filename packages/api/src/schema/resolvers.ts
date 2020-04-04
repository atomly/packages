// Utils
import { composeResolvers } from '@utils/index';

// Types
import { IQueryResolverMap } from './query/types';
import { IUsersResolverMap } from './users/types';
import { IPostResolverMap } from './posts/types';
import { ITeamsResolverMap } from './teams/types';
import { IMembersResolverMap } from './members/types';

// Resolvers
import queryResolvers from './query';
import userResolvers from './users';
import postResolvers from './posts';
import teamResolvers from './teams';
import memberResolvers from './members';

type ResolverMap = (
  IQueryResolverMap & IUsersResolverMap &
  IPostResolverMap & ITeamsResolverMap &
  IMembersResolverMap
);

export const resolvers: ResolverMap = composeResolvers<ResolverMap>(
  queryResolvers,
  userResolvers,
  postResolvers,
  teamResolvers,
  memberResolvers,
);
