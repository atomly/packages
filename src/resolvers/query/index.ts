// Types
import { Beast } from '@typings/graphql';

// Utils
import { resolverFactory } from '@utils/index';

const ping: Beast.TQueryPing = function hello(_, __, context): string {
  return `pong:qid=${context.response.req?.headers.cookie}`;
}

export default resolverFactory(
  { ping },
);
