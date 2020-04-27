// Libraries
import { GraphQLServer, PubSub } from 'graphql-yoga';
import session from 'express-session';
import connectRedisStore from 'connect-redis';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';
// import { applyMiddleware } from 'graphql-middleware';
import { Database } from '@beast/beast-entities';

// Types
import { Beast } from '@root/types/index';

// Dependencies
import { redisSessionPrefix } from '@root/constants';
import { resolvers, typeDefs } from '@root/schema';
import { redis } from '@root/redis';
import { loaders } from '@root/loaders';
import { middlewares } from '@root/middlewares';

// TypeORM DB Layer
const database = new Database({
  type: process.env.DB_CONNECTION! as 'postgres',
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  logging: process.env.NODE_ENV !== 'production',
});

// Publish & Subscribe
const pubsub = new PubSub();

/**
 * Starts the GraphQL server.
 * @return {void} - Void.
 */
export async function startServer(): Promise<void> {
  // GraphQL server setup
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as IResolvers,
  });

  // applyMiddleware(schema, ...middlewares);

  // Connecting Database
  await database.getConnection();

  const server = new GraphQLServer({
    schema,
    middlewares,
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
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    }),
  );

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
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('🚀🚀 Server ready at: http://localhost:4000  \n');
        }
      },
    );
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Something went wrong: ', error);
    }
  }
}
