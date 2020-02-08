// Types
import { Beast } from '@typings/graphql';

// Utils
import { resolverFactory } from '@utils/index';

const hello: Beast.TQueryHello = function hello(_, { name }): string {
  return `Hello ${name || 'World'}`;
}

export default resolverFactory(
  { hello },
);
