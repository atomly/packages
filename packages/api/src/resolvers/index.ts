// Utils
import { composeResolvers } from '@utils/index';

// Types
import { IQueryResolverMap } from '@resolvers/query/types';
import { IUsersResolverMap } from '@resolvers/user/types';
import { IPostResolverMap } from '@resolvers/post/types';

// Resolvers
import queryResolvers from '@resolvers/query';
import userResolvers from '@resolvers/user';
import postResolvers from '@resolvers/post';

type ResolverMap = IQueryResolverMap & IUsersResolverMap & IPostResolverMap

export const resolvers: ResolverMap = composeResolvers<ResolverMap>(
  queryResolvers,
  userResolvers,
  postResolvers,
);
