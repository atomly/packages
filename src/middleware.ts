// Types  
import { IMiddleware } from 'graphql-middleware';

// Utils
import { throwError } from '@utils/index'

export const isAuthenticated: IMiddleware = async function isAuthenticated(
  resolve,
  parent,
  args,
  context,
  info,
) {
  if (!context.request.session.userId) {
    // User is not logged in.
    throwError({
      errorType: throwError.EErrors.AUTHENTICATION_MIDDLEWARE,
      error: new Error('Not authenticated from GraphQL middleware.'),
    });
    throw new Error('[AUTHENTICATION MIDDLEWARE ERROR] Not authenticated from GraphQL middleware.');
  }
  return resolve(parent, args, context, info);
}

/**
 * Add resolver middlewares here.
 * Example: 
 * 
 *    Mutation: {
 *        createListing: isAuthenticated,
 *        deleteListing: isAuthenticated,
 *    }
 */
export const middleware = {
  Query: {},
  Mutation: {},
  Subscription: {},
};
