// Libraries
import { Beast, GQL } from '@root/types/index';
import { Posts } from '@beast/beast-entities';
import { IThrowError } from '@utils/throwError/errors'

// Posts resolvers
type TQueryPost = Beast.Resolver<null, GQL.QueryPostArgs, Promise<Posts | undefined>>
type TQueryPosts = Beast.Resolver<null, null, Promise<Posts[]>>
type TMutationNewPost= Beast.Resolver<null, GQL.MutationNewPostArgs, Promise<Posts | IThrowError>>
type TSubscriptionNewPost = Beast.Resolver<null, GQL.MutationNewPostArgs, AsyncIterator<Posts>>

export interface IPostResolverMap extends Beast.Implements<Beast.IResolver, IPostResolverMap> {
  Query: {
    post: TQueryPost
    posts: TQueryPosts
  }
  Mutation: {
    newPost: TMutationNewPost
  }
  Subscription: {
    newPostSubscription: {
      subscribe: TSubscriptionNewPost
    }
  }
}
