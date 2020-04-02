// Types
import { Beast } from '@root/types/index';

// TODO: Add support for custom type resolvers.
export function composeResolvers<T extends Beast.IResolvers>(...resolversArray: Beast.IResolvers[]): T {
  const globalResolver = resolversArray.reduce((resolvers, resolver) => {
    const {
      Query,
      Mutation,
      Subscription,
      ...Roots
    } = resolvers;
    const {
      Query: resolverQuery,
      Mutation: resolverMutation,
      Subscription: resolverSubscription,
      ...resolverRoots
    } = resolver;
    return {
      ...Roots,
      ...resolverRoots,
      Query: {
        ...Query,
        ...resolverQuery,
      },
      Mutation: {
        ...Mutation,
        ...resolverMutation,
      },
      Subscription: {
        ...Subscription,
        ...resolverSubscription,
      },
    };
  }, {
    Query: {},
    Mutation: {},
    Subscription: {},
  });
  return globalResolver as T;
}
