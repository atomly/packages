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
  // console.log("Inserting a new user into the database...");
  // const user = new User();
  // user.firstName = "Timber";
  // user.lastName = "Saw";
  // user.age = 25;
  // await connection.manager.save(user);
  // console.log("Saved a new user with id: " + user.id);
  // console.log("Loading users from the database...");
  // const users = await connection.manager.find(User);
  // console.log("Loaded users: ", users);
  // console.log("Here you can setup and run express/koa/any other framework.");

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
