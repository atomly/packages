// Types
import { Beast } from '@typings/graphql';

// Utils
import { resolverFactory, throwError } from '@utils/index';
import { IThrowError } from '@utils/throwError/errors';

const test: Beast.TQueryTest = function hello(): string | IThrowError {
  return throwError({
    status: throwError.Errors.EStatuses.NOT_IMPLEMENTED,
    message: 'test resolver',
  });
}

const ping: Beast.TQueryPing = function hello(_, __, { response }): string {
  return `pong:qid=${response.req?.headers.cookie}`;
}

export default resolverFactory(
  { test, ping },
);
