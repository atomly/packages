// Libraries  
import {
  graphql,
  ExecutionResult,
  GraphQLSchema,
} from 'graphql';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';
import { print } from 'graphql/language/printer';

// Typings
import { TSJest } from '@types/tests';

// Dependencies
import { typeDefs, resolvers } from '@root/schema';
import { context } from './mockContext';

// Schema "cache"
let cachedSchema: GraphQLSchema;

/**
 * Returns a graphql call.
 */
export async function gqlCall(
  { source, variableValues }: TSJest.IGqlCallOptions,
): Promise<ExecutionResult> {
  if (!cachedSchema) {
    // ALWAYS use makeExecutableSchema over buildSchema
    // More here: https://stackoverflow.com/a/53987189/10246377
    cachedSchema = makeExecutableSchema({
      typeDefs,
      resolvers: resolvers as IResolvers,
    });
  }
  const sanitizedSource = typeof source === 'string' ? source : print(source);
  return graphql({
    schema: cachedSchema,
    source: sanitizedSource,
    variableValues,
    contextValue: context,
  });
}
