/* eslint-disable @typescript-eslint/no-explicit-any */
// Types
import { PubSub } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { GraphQLResolveInfo } from 'graphql';
import { Redis } from 'ioredis';
import { Database } from '@beast/beast-entities';
import { loaders } from '@root/loaders';

export * as GQL from './schema';

export namespace Beast {
  // GraphQLServer.context
  interface IContext extends ContextParameters {
    pubsub: PubSub
    redis: Redis
    database: Database
    loaders: typeof loaders
  }

  // Resolver Maps
  interface IResolvers {
    [key: string]: Resolver<any, any, any>
  }
  
  interface ISubscriptionResolvers {
    [key: string]: {
      subscribe: Resolver<any, any, any>
    }
  }

  interface IResolver {
    Query?: IResolvers
    Mutation?: IResolvers
    Subscription?: ISubscriptionResolvers
  }

  // Resolvers types
  type Resolver<T, R, X> = (parent: T, args: R, context: IContext, info: GraphQLResolveInfo) => X;

  // Type helper to implement interfaces to other interfaces.
  // Helpful to implement resolvers and maintain the IResolver structure.
  type Implements<T, U extends T> = {}
}
