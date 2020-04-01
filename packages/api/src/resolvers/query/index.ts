// Types
import { IQueryResolverMap } from './types';

// Utils
import { throwError } from '@utils/index';
import { IThrowError } from '@utils/throwError/errors';

const resolvers: IQueryResolverMap = {
  Query: {
    test(): string | IThrowError {
      return throwError({
        status: throwError.Errors.EStatuses.NOT_IMPLEMENTED,
        message: 'test resolver',
      });
    },
    ping(_, __, { response }): string {
      return `pong:qid=${response.req?.headers.cookie}`;
    },
  },
}

export default resolvers;
