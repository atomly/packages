// Types
import { Prisma } from '@typings/graphql';

// Entity
import { User } from '@entity/User';

// Utils
import { resolverFactory } from '@utils/index';

const user: Prisma.TQueryUser = function user(_, { id }, context) {
  const user = context.prisma.users.findOne({ where: { id: Number(id) } });
  return user;
}

const users: Prisma.TQueryUsers = function users(_, __, context) {
  const user = context.prisma.users.findMany();
  return user;
}

const newUser: Prisma.TMutationNewUser = async function newUser(
  _,
  args,
  context,
) {
  const createdUser = User.create({
    email: args.email,
    password: args.password,
  });
  const user = await context.prisma.users.create({
    data: {
      id: createdUser.id,
      email: createdUser.email,
      password: createdUser.password,
    },
  })
  return user;
}

export default resolverFactory(
  {
    user,
    users,
  },
  {
    newUser,
  },
);
