// Types
import { Prisma } from '@typings/graphql';

// Utils
import { composeResolvers } from '@utils/index';

// Resolvers
import queryResolvers from '@resolvers/query';
import userResolvers from '@resolvers/user';

export const resolvers: Prisma.IResolverMap = composeResolvers(
  queryResolvers,
  userResolvers,
)
