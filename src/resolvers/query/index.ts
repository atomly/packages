// Types
import { Prisma } from '@typings/graphql';

const hello: Prisma.TQueryHello = function hello(_, { name }): string {
  return `Hello ${name || 'World'}`;
}

export default {
  Query: {
    hello,
  },
};
