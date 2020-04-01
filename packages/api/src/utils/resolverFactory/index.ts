/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { Beast } from '@root/types/index';

export function resolverFactory(
  queries?: Beast.IResolvers,
  mutation?: Beast.IResolvers,
  subscription?: Beast.ISubscriptionResolvers,
): Beast.IResolver {
  return {
    Query: queries,
    Mutation: mutation,
    Subscription: subscription,
  }
}
