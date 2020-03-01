/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { Beast } from '@typings/graphql';

export function resolverFactory(
  queries?: Beast.IResolverObject,
  mutation?: Beast.IResolverObject,
  subscription?: Beast.ISubscriptionObject,
): Beast.IResolver {
  return {
    Query: queries,
    Mutation: mutation,
    Subscription: subscription,
  }
}
