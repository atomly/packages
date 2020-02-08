// Libraries
import { validate } from "class-validator";
import bcrypt from 'bcrypt';

// Types
import { Beast } from '@typings/graphql';

// Entity
import { User } from '@entity/User';

// Utils
import { resolverFactory } from '@utils/index';
import { parseValidationErrors } from "@root/utils/parseValidationError";

const user: Beast.TQueryUser = async function user(_, { id }, context) {
  const user = await context.prisma.users.findOne({ where: { id: +id } });
  return user;  
}

const users: Beast.TQueryUsers = async function users(_, __, context) {
  const user = await context.prisma.users.findMany();
  return user;
}

const newUser: Beast.TMutationNewUser = async function newUser(
  _,
  args,
) {
  // Hashing the password before storing it in the database.
  const hashedPassword = await bcrypt.hash(args.input.password, 12);
  const user = User.create({
    email: args.input.email,
    password: hashedPassword,
  });
  const errors = await validate(user);
  if (errors.length > 0) {
      throw new Error(parseValidationErrors(errors, 'user')); 
  } else {
      await user.save();
      return user;
  }
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
