// Absolute Paths & TypeORM
import 'module-alias/register';
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';

// Libraries
import { GraphQLServer } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';// Libraries

// Dependencies
import { resolvers } from '@root/resolvers';
import typeDefs from '@root/schema';

// Types
import { Prisma } from '@typings/graphql';

// TypeORM configuration
import ormConfig from '../ormconfig';

/**
 * Starts the GraphQL server.
 * @return {void} - Void.
 */
export async function startServer(): Promise<void> {
  // GraphQL server setup
  const prisma = new PrismaClient();
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context(request): Prisma.IPrismaContext {
      return {
        ...request,
        prisma,
      }
    },
  });
  const connectionOptions = await getConnectionOptions();
  await createConnection({
    ...connectionOptions,
    ...ormConfig,
  });
  try {
    server.start(() => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('🚀🚀 Server ready at: http://localhost:4000  \n');
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Something went wrong: ', error);
    }
  }
}
