// Types
import { Beast } from '@typings/graphql';

// Utils
import { resolverFactory } from '@utils/index';

const ping: Beast.TQueryPing = function hello(_, __, { response }): string {
  return `pong:qid=${response.req?.headers.cookie}`;
}

export default resolverFactory(
  { ping },
);
