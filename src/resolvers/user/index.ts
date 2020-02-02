// Types
import { Prisma } from '@typings/graphql';

const user: Prisma.TQueryUser = function user(_, { id }, context) {
  const user = context.prisma.users.findOne({ where: { id: Number(id) } });
  return user;
}

const users: Prisma.TQueryUsers = function users(_, __, context) {
  const user = context.prisma.users.findMany();
  return user;
}

const newUser: Prisma.TMutationNewUser = function newUser(_, { email, password }): string {
  return email + password;
}

export default {
  Query: {
    user,
    users,
  },
  Mutation: {
    newUser,
  },
};
