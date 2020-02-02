// Absolute Paths & TypeORM
import 'module-alias/register';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
// import { User } from "./entity/User";

// Libraries
import { GraphQLServer } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client'

// Dependencies
import { resolvers } from '@root/resolvers';
import typeDefs from '@root/schema';

// Types
import { Prisma } from '@typings/graphql';

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

// createConnection().then(async connection => {
createConnection().then(() => {
  server.start(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('🚀🚀 Server ready at: http://localhost:4000  \n');
    }
  });
}).catch(error => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Something went wrong: ', error)
  }
});
