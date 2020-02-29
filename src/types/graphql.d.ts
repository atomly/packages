/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { PubSub } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { IResolvers } from 'graphql-tools';
import { GraphQLResolveInfo } from 'graphql';
import { PrismaClient, users, posts } from '@prisma/client';
import { Redis } from "ioredis";

declare namespace Beast {
  // GraphQLServer.context
  interface IContext extends ContextParameters {
    prisma: PrismaClient<{}, never>
    pubsub: PubSub
    redis: Redis
  }

  // Resolvers
  interface IResolverObject {
    [key: string]: Beast.GResolver<any, any, any>
  }
  
  interface ISubscriptionObject {
    [key: string]: {
      subscribe: Beast.GResolver<any, any, any>
    }
  }

  // Resolvers types
  type GResolver<T, R, X> = (parent: T, args: R, context: IContext, info: GraphQLResolveInfo) => X;
  type ResolverParameters<T, R, X> = Parameters<(parent: T, args: R, context: IContext, info: GraphQLResolveInfo) => X>

  interface IResolver {
    Query?: IResolverObject
    Mutation?: IResolverObject
    Subscription?: ISubscriptionObject
  }

  // GraphQLServer.resolvers
  interface IResolverMap extends IResolvers {
    // Queries
    Query: {
      test: TQueryTest
      ping: TQueryPing
      user: TQueryUser
      users: TQueryUsers
      me: TQueryMe
      post: TQueryPost
      posts: TQueryPosts
    }
    // Mutations
    Mutation: {
      newUser: TMutationNewUser
      authenticate: TMutationAuthenticate
      logout: TMutationLogout
      newPost: TMutationNewPost
      subscriptionPost: TSubscriptionNewPost
    }
  }

  // Custom Query resolvers
  type TQueryTest = GResolver<null, null, string | Errors.IThrowError>
  type TQueryPing = GResolver<null, null, string>

  // User resolvers
  type TQueryUser = GResolver<null, GQL.IUserOnQueryArguments, Promise<users | null>>
  type TQueryUsers = GResolver<null, null, Promise<users[]>>
  type TQueryMe = GResolver<null, null, Promise<users | null>>
  type TMutationNewUser= GResolver<null, GQL.INewUserOnMutationArguments, Promise<users | Errors.IThrowError>>
  type TMutationAuthenticate = GResolver<null, GQL.IAuthenticateOnMutationArguments, Promise<users | null | Errors.IThrowError>>
  type TMutationLogout = GResolver<null, null, Promise<boolean | Errors.IThrowError>>

  // Post resolvers
  type TQueryPost = GResolver<null, GQL.IPostOnQueryArguments, Promise<posts | null>>
  type TQueryPosts = GResolver<null, null, Promise<posts[]>>
  type TMutationNewPost= GResolver<null, GQL.INewPostOnMutationArguments, Promise<posts | Errors.IThrowError>>
  type TSubscriptionNewPost = GResolver<null, GQL.INewPostOnMutationArguments, AsyncIterator<posts>>
}
