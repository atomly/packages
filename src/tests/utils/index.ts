// Libraries
import {
  graphql,
  buildSchema,
  ExecutionResult,
} from 'graphql';

// Typings
import { TSJest } from '@typings/tests';

// Dependencies
import schema from '../../schema';

export const tsGlobal = global as unknown as TSJest.Global

/**
 * Returns a graphql call.
 */
export async function gqlCall(
  { source, variableValues }: TSJest.IGqlCallOptions,
): Promise<ExecutionResult> {
  return graphql({
    schema: await buildSchema(schema),
    source,
    variableValues,
  });
}
