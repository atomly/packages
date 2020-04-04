// Libraries
import { Beast, GQL } from '@root/types/index';
import { Members, Posts } from '@beast/beast-entities';

// Member resolvers
type TResolverMemberPosts = Beast.Resolver<Members, null, Promise<Posts[]>>

type TQueryMember = Beast.Resolver<null, GQL.QueryMemberArgs, Promise<Members | undefined>>
type TQueryMembers = Beast.Resolver<null, null, Promise<Members[]>>

export interface IMembersResolverMap extends Beast.IResolvers {
  Member: {
    posts: TResolverMemberPosts
  }
  Query: {
    member: TQueryMember
    members: TQueryMembers
  }
}
