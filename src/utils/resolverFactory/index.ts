/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { Prisma } from '@typings/graphql';

interface IResolverObject {
  [key: string]: Prisma.GPrismaResolver<any, any, any>
}

export function resolverFactory(
  queries?: IResolverObject,
  mutation?: IResolverObject,
  subscription?: IResolverObject,
): Prisma.IResolver {
  return {
    Query: queries,
    Mutation: mutation,
    Subscription: subscription,
  }
}
