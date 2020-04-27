/* eslint-disable @typescript-eslint/no-explicit-any */
// Types  
import {
  GraphQLResolveInfo,
  GraphQLFieldResolver,
} from 'graphql';
import { Beast } from '@root/types';

// Utils
import { throwError } from '@utils/index'

export interface IDepthLimitConfig {
  maxDepth: number
  hashConfig: {
    asString: boolean
    maxStrLength: number
    seed?: number
  }
}

export interface IDepthLimitMiddleware {
  config: IDepthLimitConfig
  depthCache: Map<string, number>
  depthLimit: (
    resolve: GraphQLFieldResolver<any, Beast.IContext>,
    parent: any,
    args: any,
    context: Beast.IContext,
    info: GraphQLResolveInfo,
  ) => ReturnType<GraphQLFieldResolver<any, Beast.IContext>> | ReturnType<typeof throwError>
}
