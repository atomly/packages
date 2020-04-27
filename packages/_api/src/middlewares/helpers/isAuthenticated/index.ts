// Types  
import { IMiddleware } from 'graphql-middleware';

// Utils
import { throwError } from '@utils/index'

export const isAuthenticated: IMiddleware = async function (
  resolve,
  parent,
  args,
  context,
  info,
) {
  if (!context.request.session.userId) {
    // User is not logged in.
    return throwError({
      status: throwError.Errors.EStatuses.NETWORK_AUTHENTICATION_REQUIRED,
      message: 'User not found in the session',
    });
  }
  return resolve(parent, args, context, info);
}
