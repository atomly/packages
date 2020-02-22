// Libraries
import { createConnection, getConnectionOptions } from 'typeorm';
import { GraphQLServer } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';// Libraries
import session from 'express-session';
import connectRedisStore from 'connect-redis';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';

// Dependencies
import { redisSessionPrefix } from '@root/constants';
import { resolvers } from '@root/resolvers';
import typeDefs from '@root/schema';
import { redis } from '@redis/index';
import { middleware } from '@root/middleware';

// Types
import { Beast } from '@typings/graphql';

// TypeORM configuration
import ormConfig from '../ormconfig';

/**
 * Starts the GraphQL server.
 * @return {void} - Void.
 */
export async function startServer(): Promise<void> {
  // GraphQL server setup
  const prisma = new PrismaClient();
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  applyMiddleware(schema, middleware);
  const server = new GraphQLServer({
    schema,
    context(context): Beast.IContext {
      return {
        ...context,
        prisma,
        redis,
        session: context.request.session,
      }
    },
  });

  const RedisStore = connectRedisStore(session);

  // Setting up sessions stored in Redis for user authentication on login
  server.express.use(
    session({
      store: new RedisStore({
        client: redis,
        prefix: redisSessionPrefix,
      }),
      name: 'qid',
      secret: process.env.SESSION_SECRET_KEY as string,
      resave: true,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    }),
  )

  try {
    const connectionOptions = await getConnectionOptions();
  
    await createConnection({
      ...connectionOptions,
      ...ormConfig,
    });

    server.start(
      // Options
      {
        port: 4000,
        // Setting up cors
        cors: {
          credentials: true,
          origin: ['http://localhost:8000'], // Frontend URL
        },
      },
      () => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('🚀🚀 Server ready at: http://localhost:4000  \n');
        }
      },
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Something went wrong: ', error);
    }
  }
}
