// Libraries  
import {
  graphql,
  ExecutionResult,
  GraphQLSchema,
} from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

// Typings
import { TSJest } from '@typings/tests';

// Dependencies
import { resolvers } from '@root/resolvers';
import typeDefs from '@root/schema';

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
    cachedSchema = await makeExecutableSchema({
      typeDefs,
      resolvers,
    });
  }
  return graphql({
    schema: cachedSchema,
    source,
    variableValues,
  });
}
