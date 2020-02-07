// Types
import { Prisma } from '@typings/graphql';

// Entity
import { User } from '@entity/User';

// Utils
import { resolverFactory } from '@utils/index';

const user: Prisma.TQueryUser = async function user(_, { id }, context) {
  const user = await context.prisma.users.findOne({ where: { id: +id } });
  return user;  
}

const users: Prisma.TQueryUsers = async function users(_, __, context) {
  const user = await context.prisma.users.findMany();
  return user;
}

const newUser: Prisma.TMutationNewUser = async function newUser(
  _,
  args,
) {
  const user = User.create({
    email: args.email,
    password: args.password,
  });
  await user.save();
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
