// Types  
import { IMiddleware } from 'graphql-middleware';

// Dependencies
import { depthLimits } from './depthLimits';

/**
 * Add resolver middlewares here.
 * Example: 
 * 
 *    Mutation: {
 *        createListing: isAuthenticated,
 *        deleteListing: isAuthenticated,
 *    }
 */
export const middlewares: IMiddleware[] = [depthLimits];
