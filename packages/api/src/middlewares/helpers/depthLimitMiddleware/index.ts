/* eslint-disable @typescript-eslint/no-explicit-any */
// Types  
import {
  FieldNode,
  SelectionNode,
  FragmentSpreadNode,
  GraphQLResolveInfo,
  GraphQLFieldResolver,
} from 'graphql';
import { Beast } from '@root/types';

// Utils
import { throwError } from '@utils/index'

interface IHashConfig {
  asString: boolean
  maxStrLength: number
  seed?: number
}

interface IDepthLimitConfig {
  maxDepth: number
  hashConfig: IHashConfig
}

interface IDepthLimitMiddleware {
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

export class DepthLimitMiddleware implements IDepthLimitMiddleware {
  /**
   * Calculate a 32 bit FNV-1a hash
   * Found here: https://gist.github.com/vaiorabbit/5657561
   * Ref.: http://isthe.com/chongo/tech/comp/fnv/
   * Info: https://stackoverflow.com/a/22429679/10246377
   *
   * @param {string} - The input value.
   * @param {boolean} - Set to true to return the hash value as 
   *                    8-digit hex string instead of an intege.
   * @param {number} - Optionally pass the hash of the previous chunk
   * @returns {number | string}
   */
  static hashFnv32a(str: string, asString: boolean, seed?: number, maxStrLength = 25): number | string {
    let hval = (seed === undefined) ? 0x811c9dc5 : seed;
    for (let i = 0; i < Math.min(str.length, maxStrLength); i++) {
      hval ^= str.charCodeAt(i);
      hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if( asString ){
      // Convert to 8 digit hex string
      return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
  }

  constructor(config: IDepthLimitConfig) {
    this.config = config;
    this.depthCache = new Map();
    // Bindings:
    this.measureDepth = this.measureDepth.bind(this);
    this.rejectQuery = this.rejectQuery.bind(this);
    this.depthLimit = this.depthLimit.bind(this);
  }

  private getQueryId(context: Beast.IContext, info: GraphQLResolveInfo): string {
    const rawQueryId = context.connection ?
      `${info.fieldName}_${context.connection.query}` :
      `${info.fieldName}_${context.request.body.query}`;
    if (process.env.NODE_ENV === 'production') {
      return DepthLimitMiddleware.hashFnv32a(
        rawQueryId,
        true,
        undefined,
        this.config.hashConfig.maxStrLength + info.fieldName.length + 1,
      ) as string;
    }
    return rawQueryId;
  }

  private measureDepth(
    info: GraphQLResolveInfo,
    selections: readonly (FieldNode | SelectionNode | FragmentSpreadNode)[],
    branchDepth = 1,
    queryDepth: { max: number } = { max: 1 },
  ): { max: number } {
    queryDepth.max = Math.max(branchDepth, queryDepth.max);
    for (const selection of selections) {
      if (selection.kind === 'FragmentSpread') {
        const field = info.fragments[selection.name.value];
        this.measureDepth(
          info,
          field.selectionSet.selections,
          branchDepth + 1,
          queryDepth,
        );
      } else if (selection.kind === 'Field') {
        if (selection.selectionSet) {
          this.measureDepth(
            info,
            selection.selectionSet.selections,
            branchDepth + 1,
            queryDepth,
          );
        }
      }
    }
    return queryDepth;
  }

  private rejectQuery(): ReturnType<typeof throwError> {
    return throwError({
      status: throwError.Errors.EStatuses.GRAPHQL_MAX_QUERY_DEPTH_REACHED,
      message: `Queries can only have a max depth of: [${this.config.maxDepth}].`,
    });
  }

  public config: IDepthLimitConfig

  public depthCache: Map<string, number>

  public depthLimit(
    resolve: GraphQLFieldResolver<any, Beast.IContext>,
    parent: any,
    args: any,
    context: Beast.IContext,
    info: GraphQLResolveInfo,
  ): ReturnType<GraphQLFieldResolver<any, Beast.IContext>> | ReturnType<typeof throwError> {
    const queryId = this.getQueryId(context, info);
    const cachedQueryDepth = this.depthCache.get(queryId);
    if (!cachedQueryDepth) {
      const { max: depth } = this.measureDepth(
        info,
        info.operation.selectionSet.selections,
        1,
      );
      this.depthCache.set(queryId, depth);
      if (depth > this.config.maxDepth) {
        return this.rejectQuery();
      }
    } else if (cachedQueryDepth > this.config.maxDepth) {
      return this.rejectQuery();
    }
    return resolve(parent, args, context, info);
  }
}
