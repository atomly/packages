// Libraries
import { validate } from 'class-validator';
import bcrypt from 'bcrypt';

// Types
import { Beast } from '@typings/graphql';

// Entity
import { User } from '@entity/User';

// Utils
import { resolverFactory } from '@utils/index';
import { addUserSession, parseValidationErrors, removeAllUserSessions } from '@root/utils';

//
// QUERIES
//

const user: Beast.TQueryUser = async function user(_, { id }, { prisma }) {
  const user = await prisma.users.findOne({ where: { id: +id } });
  return user;  
}

const users: Beast.TQueryUsers = async function users(_, __, { prisma }) {
  const users = await prisma.users.findMany();
  return users;
}

const me: Beast.TQueryMe = async function authenticate(
  _,
  __,
  { request, prisma },
) {
  let user;
  if (request.session?.userId) {
    user = await prisma.users.findOne({
      where: {
        id: request.session.userId,
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
  { request, redis },
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
    // If there's a user logged in the existing session, delete it.
    if (request.session?.userId) {
      await removeAllUserSessions(request.session.userId, redis);
    }
    // Log the user in by saving his/her session.
    request.session!.userId = user.id;
    if (request.sessionID) {
      await addUserSession(redis, user.id, request.sessionID);
    }
    return user;
  }
}

const authenticate: Beast.TMutationAuthenticate = async function authenticate(
  _,
  args,
  { request, prisma, redis },
) {
  if (!request.session?.userId) {
    const user = await prisma.users.findOne({
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
    // Save user's ID to the session and Redis.
    request.session!.userId = user.id;
    if (request.sessionID) {
      await addUserSession(redis, user.id, request.sessionID);
    }
    return user;
  }
  throw new Error('[AUTHENTICATION ERROR]: Already logged in.');
}

const logout: Beast.TMutationLogout = async function logout(_, __, { redis, response, request }) {
  if (request.session?.userId) {
    await removeAllUserSessions(request.session.userId, redis);
    request.session.destroy(err => {
      // If error return false or report error if in development or test.
      if (err) {
        if (
          process.env.NODE_ENV === 'development' ||
          process.env.NODE_ENV === 'test'
        ) {
          throw new Error(`[LOGOUT ERROR]: something went wrong when logging the user out: ${err.message}`);
        }
      }
    });
    response.clearCookie("qid");
    return true;
  }
  throw new Error('[LOGOUT ERROR]: Not logged in.');
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
    logout,
  },
);
