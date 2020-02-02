/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { ContextParameters } from 'graphql-yoga/dist/types';
import { IResolvers } from 'graphql-tools';
import { GraphQLResolveInfo } from 'graphql';
import { PrismaClient, usersClient, users } from '@prisma/client';

declare namespace Prisma {
  // GraphQLServer.context
  interface IPrismaContext extends ContextParameters {
    prisma: Prisma.Client
  }

  // GraphQLServer.context.prisma
  type Client = PrismaClient<{}, never>

  // Resolvers type
  type GPrismaResolver<T, R, X> = (parent: T, args: R, context: IPrismaContext, info: GraphQLResolveInfo) => X;
  type PrismaResolverParameters<T, R, X> = Parameters<(parent: T, args: R, context: IPrismaContext, info: GraphQLResolveInfo) => X>

  interface IResolver {
    Query?: {
      [key: string]: Prisma.GPrismaResolver<any, any, any>
    }
    Mutation?: {
      [key: string]: Prisma.GPrismaResolver<any, any, any>
    }
    Subscription?: {
      [key: string]: Prisma.GPrismaResolver<any, any, any>
    }
  }

  // GraphQLServer.resolvers
  interface IResolverMap extends IResolvers {
    // Queries
    Query: {
      hello: TQueryHello
      user: TQueryUser
      users: TQueryUsers
    }
    // Mutations
    Mutation: {
      newUser: TMutationNewUser
    }
  }
  // Custom Query resolvers
  type TQueryHello = GPrismaResolver<null, GQL.IHelloOnQueryArguments, string>

  // User resolvers
  type TQueryUser = GPrismaResolver<null, GQL.IUserOnQueryArguments, usersClient<users | null>>
  type TQueryUsers = GPrismaResolver<null, null, Promise<users[]>>
  type TMutationNewUser= GPrismaResolver<null, GQL.INewUserOnMutationArguments, string>
}
