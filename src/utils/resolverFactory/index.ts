/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { Beast } from '@typings/graphql';

interface IResolverObject {
  [key: string]: Beast.GPrismaResolver<any, any, any>
}

export function resolverFactory(
  queries?: IResolverObject,
  mutation?: IResolverObject,
  subscription?: IResolverObject,
): Beast.IResolver {
  return {
    Query: queries,
    Mutation: mutation,
    Subscription: subscription,
  }
}
