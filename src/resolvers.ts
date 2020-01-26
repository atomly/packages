// Types
import { Prisma } from '@typings/graphql';

// Resolvers
import userResolvers from '@resolvers/user';

export const resolvers: Prisma.IResolverMap = {
  Query: {
    hello(_, { name }): string {
      return `Hello ${name || 'World'}`;
    },
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
}
