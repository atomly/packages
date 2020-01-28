// Types
import { Prisma } from '@typings/graphql';

export function composeResolvers(...resolvers: Prisma.IResolver[]): Prisma.IResolver {
  const globalResolver = {
    Query: {},
    Mutation: {},
    Subscription: {},
  };
  resolvers.forEach(resolver => {
    Object.assign(globalResolver.Query, resolver.Query);
    Object.assign(globalResolver.Mutation, resolver.Mutation);
    Object.assign(globalResolver.Subscription, resolver.Subscription);
  });
  return globalResolver;
}
