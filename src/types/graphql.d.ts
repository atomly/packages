/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { ContextParameters } from 'graphql-yoga/dist/types';
import { IResolvers } from 'graphql-tools';
import { GraphQLResolveInfo } from 'graphql';
import { PrismaClient, users } from '@prisma/client';
import { Redis } from "ioredis";

export interface Session extends Express.Session {
  userId?: string;
}

declare namespace Beast {
  // GraphQLServer.context
  interface IContext extends ContextParameters {
    prisma: Beast.Client
    redis: Redis;
    session: Session | undefined;
  }

  // GraphQLServer.context.prisma
  type Client = PrismaClient<{}, never>

  // Resolvers type
  type GPrismaResolver<T, R, X> = (parent: T, args: R, context: IContext, info: GraphQLResolveInfo) => X;
  type PrismaResolverParameters<T, R, X> = Parameters<(parent: T, args: R, context: IContext, info: GraphQLResolveInfo) => X>

  interface IResolver {
    Query?: {
      [key: string]: Beast.GPrismaResolver<any, any, any>
    }
    Mutation?: {
      [key: string]: Beast.GPrismaResolver<any, any, any>
    }
    Subscription?: {
      [key: string]: Beast.GPrismaResolver<any, any, any>
    }
  }

  // GraphQLServer.resolvers
  interface IResolverMap extends IResolvers {
    // Queries
    Query: {
      hello: TQueryHello
      user: TQueryUser
      users: TQueryUsers
      me: TQueryUser
    }
    // Mutations
    Mutation: {
      newUser: TMutationNewUser
      authenticate: TMutationAuthenticate
    }
  }
  // Custom Query resolvers
  type TQueryHello = GPrismaResolver<null, GQL.IHelloOnQueryArguments, string>
  type TQueryPing = GPrismaResolver<null, null, string>

  // User resolvers
  type TQueryUser = GPrismaResolver<null, GQL.IUserOnQueryArguments, Promise<users | null>>
  type TQueryUsers = GPrismaResolver<null, null, Promise<users[]>>
  type TQueryMe = GPrismaResolver<null, null, Promise<users | null>>
  type TMutationNewUser= GPrismaResolver<null, GQL.INewUserOnMutationArguments, Promise<users>>
  type TMutationAuthenticate = GPrismaResolver<null, GQL.IAuthenticateOnMutationArguments, Promise<users | null>>
  type TMutationLogout = GPrismaResolver<null, null, Promise<boolean>>
}
