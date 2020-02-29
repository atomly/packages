// Libraries
import bcrypt from 'bcrypt';

// Types
import { Beast } from '@typings/graphql';

// Entity
import { User } from '@entity/User';

// Utils
import { resolverFactory, throwError } from '@utils/index';
import { addUserSession, removeAllUserSessions, validateNewEntity } from '@root/utils';

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
  }
  return null;
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
  // Validate the user, then return the result.
  const result = await validateNewEntity(user, async () => {
    try {
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
    } catch (error) {
      return throwError({
        status: throwError.Errors.EStatuses.AUTHENTICATION,
        message: `Error while creating a new user: ${error.message}`,
      });
    }
  });
  return result;
}

const authenticate: Beast.TMutationAuthenticate = async function authenticate(
  _,
  args,
  { request, prisma, redis },
) {
  // Check if there is no user logged in.
  if (!request.session?.userId) {
    const user = await prisma.users.findOne({
      where: {
        email: args.input.email.toLowerCase(),
      },
    });
    // If there is no user found, return error response.
    if (!user) {
      return throwError({
        status: throwError.Errors.EStatuses.AUTHENTICATION,
        message: `User with email: [${args.input.email.toLowerCase()}] not found.`,
        shouldDisplayMessageInProduction: false,
      });
    }
    // Try to decrypt password.
    const isValid = await bcrypt.compare(args.input.password, user.password);
    // If the password is not valid, return error response.
    if (!isValid) {
      return throwError({
        status: throwError.Errors.EStatuses.AUTHENTICATION,
        message: 'Passwords do not match.',
        shouldDisplayMessageInProduction: false,
      });
    }
    // Save user's ID to the session and Redis.
    request.session!.userId = user.id;
    if (request.sessionID) {
      await addUserSession(redis, user.id, request.sessionID);
    }
    return user;
  }
  //If there's an authenticated user in this session, return error response.
  return throwError({
    status: throwError.Errors.EStatuses.AUTHENTICATION,
    message: 'User already logged in.',
  });
}

const logout: Beast.TMutationLogout = async function logout(_, __, { redis, response, request }) {
  // Check if there is a user saved in the session.
  if (request.session?.userId) {
    await removeAllUserSessions(request.session.userId, redis);
    request.session.destroy(err => {
      // If error, return throw error response.
      if (err) {
        throwError({
          status: throwError.Errors.EStatuses.INTERNAL_SERVER_ERROR,
          message: `Something went wrong when logging the user out: ${err.message}`,
          details: 'Logout resolver. Error originated from the Redis store.',
        });
      }
    });
    response.clearCookie('qid');
    return true;
  }
  return throwError({
    status: throwError.Errors.EStatuses.INTERNAL_SERVER_ERROR,
    message: 'Not logged in. No user found in session.',
  });
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
