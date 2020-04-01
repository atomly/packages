// Libraries
import bcrypt from 'bcrypt';
import { Users } from '@beast/beast-entities';

// Types
import { IUsersResolverMap } from './types';
import { IThrowError } from '@root/utils/throwError/errors';

// Utils
import { throwError } from '@utils/index';
import { addUserSession, removeAllUserSessions, validateNewEntity } from '@root/utils';

//
// MUTATIONS
//

const resolvers: IUsersResolverMap = {
  Query: {
    async user(_, { id }, { database }): Promise<Users | undefined> {
      const user = await database.connection.getRepository(Users).findOne({ where: { id: +id } });
      return user;  
    },
    async users(_, __, { database }): Promise<Users[]> {
      const users = await database.connection.getRepository(Users).find();
      return users;
    },
    async me(
      _,
      __,
      { request, database },
    ): Promise<Users | undefined> {
      let user;
      if (request.session?.userId) {
        user = await database.connection.getRepository(Users).findOne({
          where: {
            id: request.session.userId,
          },
        });
      }
      if (user) {
        return user;
      }
      return undefined;
    },
  },
  Mutation: {
    async newUser(
      _,
      args,
      { request, redis, database },
    ): Promise<Users | IThrowError> {
      // Hashing the password before storing it in the database.
      const hashedPassword = await bcrypt.hash(args.input.password, 12);
      const user = database.connection.getRepository(Users).create({
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
    },
    async authenticate(
      _,
      args,
      { request, redis, database },
    ): Promise<Users | undefined | IThrowError> {
      // Check if there is no user logged in.
      if (!request.session?.userId) {
        const user = await database.connection.getRepository(Users).findOne({
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
      // If there's an authenticated user in this session, return error response.
      return throwError({
        status: throwError.Errors.EStatuses.AUTHENTICATION,
        message: 'User already logged in.',
      });
    },
    async logout(_, __, { redis, response, request }): Promise<boolean | IThrowError> {
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
    },
  },
}

export default resolvers;
