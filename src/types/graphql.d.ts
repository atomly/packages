/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { PubSub } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { IResolvers } from 'graphql-tools';
import { GraphQLResolveInfo } from 'graphql';
import { PrismaClient, users, posts } from '@prisma/client';
import { Redis } from "ioredis";

export interface Session extends Express.Session {
  userId?: string;
}

declare namespace Beast {
  // GraphQLServer.context
  interface IContext extends ContextParameters {
    prisma: Beast.Client
    pubsub: PubSub
    redis: Redis
    session: Session | undefined
  }

  // Resolvers
  interface IResolverObject {
    [key: string]: Beast.GPrismaResolver<any, any, any>
  }
  
  interface ISubscriptionObject {
    [key: string]: {
      subscribe: Beast.GPrismaResolver<any, any, any>
    }
  }

  // GraphQLServer.context.prisma
  type Client = PrismaClient<{}, never>

  // Resolvers type
  type GPrismaResolver<T, R, X> = (parent: T, args: R, context: IContext, info: GraphQLResolveInfo) => X;
  type PrismaResolverParameters<T, R, X> = Parameters<(parent: T, args: R, context: IContext, info: GraphQLResolveInfo) => X>

  interface IResolver {
    Query?: IResolverObject
    Mutation?: IResolverObject
    Subscription?: ISubscriptionObject
  }

  // GraphQLServer.resolvers
  interface IResolverMap extends IResolvers {
    // Queries
    Query: {
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
  type TQueryPing = GPrismaResolver<null, null, string>

  // User resolvers
  type TQueryUser = GPrismaResolver<null, GQL.IUserOnQueryArguments, Promise<users | null>>
  type TQueryUsers = GPrismaResolver<null, null, Promise<users[]>>
  type TQueryMe = GPrismaResolver<null, null, Promise<users | null>>
  type TMutationNewUser= GPrismaResolver<null, GQL.INewUserOnMutationArguments, Promise<users>>
  type TMutationAuthenticate = GPrismaResolver<null, GQL.IAuthenticateOnMutationArguments, Promise<users | null>>
  type TMutationLogout = GPrismaResolver<null, null, Promise<boolean>>

  // Post resolvers
  type TQueryPost = GPrismaResolver<null, GQL.IPostOnQueryArguments, Promise<posts | null>>
  type TQueryPosts = GPrismaResolver<null, null, Promise<posts[]>>
  type TMutationNewPost= GPrismaResolver<null, GQL.INewPostOnMutationArguments, Promise<posts>>
  type TSubscriptionNewPost = GPrismaResolver<null, GQL.INewPostOnMutationArguments, AsyncIterator<posts>>
}
