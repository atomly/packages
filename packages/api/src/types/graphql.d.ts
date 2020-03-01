/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { PubSub } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { IResolvers } from 'graphql-tools';
import { GraphQLResolveInfo } from 'graphql';
import { Redis } from "ioredis";
import { Database } from '@root/database';
import { loaders } from '@root/loaders';
import * as Errors from '@utils/throwError/errors'
import * as GQL from './schema';

// Entity Types
import { Post } from '@root/entity/Post';
import { User } from '@root/entity/User';

export namespace Beast {
  // GraphQLServer.context
  interface IContext extends ContextParameters {
    pubsub: PubSub
    redis: Redis
    database: Database
    loaders: typeof loaders
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
  type TQueryUser = GResolver<null, GQL.QueryUserArgs, Promise<User | undefined>>
  type TQueryUsers = GResolver<null, null, Promise<User[]>>
  type TQueryMe = GResolver<null, null, Promise<User | null>>
  type TMutationNewUser= GResolver<null, GQL.MutationNewUserArgs, Promise<User | Errors.IThrowError>>
  type TMutationAuthenticate = GResolver<null, GQL.MutationAuthenticateArgs, Promise<User | undefined | Errors.IThrowError>>
  type TMutationLogout = GResolver<null, null, Promise<boolean | Errors.IThrowError>>

  // Post resolvers
  type TQueryPost = GResolver<null, GQL.QueryPostArgs, Promise<Post | undefined>>
  type TQueryPosts = GResolver<null, null, Promise<Post[]>>
  type TMutationNewPost= GResolver<null, GQL.MutationNewPostArgs, Promise<Post | Errors.IThrowError>>
  type TSubscriptionNewPost = GResolver<null, GQL.MutationNewPostArgs, AsyncIterator<Post>>
}
