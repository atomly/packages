// Libraries
import { Beast, GQL } from '@root/types/index';
import { Users, Posts } from '@beast/beast-entities';
import { IThrowError } from '@utils/throwError/errors'

// User resolvers
type TResolverUserPosts = Beast.Resolver<Users, GQL.UserPostsArgs, Promise<Posts[]>>

type TQueryUser = Beast.Resolver<null, GQL.QueryUserArgs, Promise<Users | undefined>>
type TQueryUsers = Beast.Resolver<null, null, Promise<Users[]>>
type TQueryMe = Beast.Resolver<null, null, Promise<Users | undefined>>

type TMutationNewUser= Beast.Resolver<null, GQL.MutationNewUserArgs, Promise<Users | IThrowError>>
type TMutationAuthenticate = Beast.Resolver<null, GQL.MutationAuthenticateArgs, Promise<Users | undefined | IThrowError>>
type TMutationLogout = Beast.Resolver<null, null, Promise<boolean | IThrowError>>

export interface IUsersResolverMap extends Beast.IResolvers {
  User: {
    posts: TResolverUserPosts
  }
  Query: {
    user: TQueryUser
    users: TQueryUsers
    me: TQueryMe
  }
  Mutation: {
    newUser: TMutationNewUser
    authenticate: TMutationAuthenticate
    logout: TMutationLogout
  }
}
