// Types
import { Prisma } from '@typings/graphql';

// Resolvers
import queryResolvers from '@resolvers/query';
import userResolvers from '@resolvers/user';

export const resolvers: Prisma.IResolverMap = {
  Query: {
    ...queryResolvers,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
}
