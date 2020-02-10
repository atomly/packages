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

//
// QUERIES
//

const user: Beast.TQueryUser = async function user(_, { id }, context) {
  const user = await context.prisma.users.findOne({ where: { id: +id } });
  return user;  
}

const users: Beast.TQueryUsers = async function users(_, __, context) {
  const user = await context.prisma.users.findMany();
  return user;
}

const me: Beast.TQueryMe = async function authenticate(
  _,
  __,
  context,
) {
  let user;
  if (context.request.session?.userId) {
    user = await context.prisma.users.findOne({
      where: {
        id: context.request.session.userId,
      },
    });
  }
  if (user) {
    return user;
  } else {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      throw new Error(`[QUERY ERROR]: user not found or not saved in session.`);
    } else {
      return null;
    }
  }
}

//
// MUTATIONS
//

const newUser: Beast.TMutationNewUser = async function newUser(
  _,
  args,
) {
  // Hashing the password before storing it in the database.
  const hashedPassword = await bcrypt.hash(args.input.password, 12);
  const user = User.create({
    email: args.input.email.toLowerCase(),
    password: hashedPassword,
  });
  const errors = await validate(user);
  if (errors.length > 0) {
    throw new Error(parseValidationErrors(errors, 'user')); 
  } else {
    await user.save();
    // TODO: Set up session
    return user;
  }
}

const authenticate: Beast.TMutationAuthenticate = async function authenticate(
  _,
  args,
  context,
) {
  const user = await context.prisma.users.findOne({
    where: {
      email: args.input.email.toLowerCase(),
    },
  });

  if (!user) {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      throw new Error(`[AUTHENTICATION ERROR]: user with email: [${args.input.email.toLowerCase()}] not found.`);
    } else {
      return null;
    }
  }

  const isValid = await bcrypt.compare(args.input.password, user.password);

  if (!isValid) {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      throw new Error('[AUTHENTICATION ERROR]: passwords do not match.');
    } else {
      return null;
    }
  }

  // Save user's ID to the session.
  // TODO: Possibly save more than just the user id to the session.
  context.request.session!.userId = user.id;

  return user;
}

export default resolverFactory(
  {
    user,
    users,
    me,
  },
  {
    newUser,
    authenticate,
  },
);
