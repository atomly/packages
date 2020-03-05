// Libraries
import { GraphQLServer, PubSub } from 'graphql-yoga';
import session from 'express-session';
import connectRedisStore from 'connect-redis';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';

// Dependencies
import { redisSessionPrefix } from '@root/constants';
import { resolvers } from '@root/resolvers';
import typeDefs from '@root/schema';
import { middleware } from '@root/middleware';

// Types
import { Beast } from '@typings/graphql';

// Redis, TypeORM DB Manager & DataLoaders
import { redis } from '@root/redis';
import { Database } from "@root/database";
import { loaders } from '@root/loaders';

// DB Layers.
const database = new Database(); // TypeORM

/**
 * Starts the GraphQL server.
 * @return {void} - Void.
 */
export async function startServer(): Promise<void> {
  // GraphQL server setup
  const pubsub = new PubSub(); // Subscriptions.
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  applyMiddleware(schema, middleware);

  // Connecting Database
  await database.getConnection();

  const server = new GraphQLServer({
    schema,
    context(context): Beast.IContext {
      return {
        ...context,
        pubsub,
        redis,
        database,
        loaders,
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
