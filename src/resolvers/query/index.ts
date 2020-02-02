// Types
import { Prisma } from '@typings/graphql';

// Utils
import { resolverFactory } from '@utils/index';

const hello: Prisma.TQueryHello = function hello(_, { name }): string {
  return `Hello ${name || 'World'}`;
}

export default resolverFactory(
  { hello },
);
