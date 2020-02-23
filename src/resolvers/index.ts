// Types
import { Beast } from '@typings/graphql';

// Utils
import { composeResolvers } from '@utils/index';

// Resolvers
import queryResolvers from '@resolvers/query';
import userResolvers from '@resolvers/user';
import postResolvers from '@resolvers/post';

export const resolvers: Beast.IResolverMap = composeResolvers(
  queryResolvers,
  userResolvers,
  postResolvers,
)
