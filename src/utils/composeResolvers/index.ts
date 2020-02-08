// Types
import { Beast } from '@typings/graphql';

export function composeResolvers<T>(...resolvers: Beast.IResolver[]): T {
  const globalResolver = resolvers.reduce((resolvers, resolver) => {
    return {
      Query: {
        ...resolvers.Query,
        ...resolver.Query,
      },
      Mutation: {
        ...resolvers.Mutation,
        ...resolver.Mutation,
      },
      Subscription: {
        ...resolvers.Subscription,
        ...resolver.Subscription,
      },
    };
  }, {
    Query: {},
    Mutation: {},
    Subscription: {},
  });
  return globalResolver as T;
}
