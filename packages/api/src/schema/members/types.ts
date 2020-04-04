// Libraries
import { Beast, GQL } from '@root/types/index';
import { Members, Posts, Profiles } from '@beast/beast-entities';

// Member resolvers
type TResolverMemberProfile = Beast.Resolver<Members, null, Promise<Profiles>>
type TResolverMemberPosts = Beast.Resolver<Members, null, Promise<Posts[]>>

type TQueryMember = Beast.Resolver<null, GQL.QueryMemberArgs, Promise<Members | undefined>>
type TQueryMembers = Beast.Resolver<null, null, Promise<Members[]>>

export interface IMembersResolverMap extends Beast.IResolvers {
  Member: {
    profile: TResolverMemberProfile
    posts: TResolverMemberPosts
  }
  Query: {
    member: TQueryMember
    members: TQueryMembers
  }
}
