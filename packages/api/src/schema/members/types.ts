// Libraries
import { Beast, GQL } from '@root/types/index';
import { Members, Posts, Profiles, Teams } from '@beast/beast-entities';

// Member resolvers
type TResolverMemberProfile = Beast.Resolver<Members, null, Promise<Profiles>>
type TResolverMemberPosts = Beast.Resolver<Members, null, Promise<Posts[]>>
type TResolverMemberTeams = Beast.Resolver<Members, null, Promise<Teams[]>>

type TQueryMember = Beast.Resolver<null, GQL.QueryMemberArgs, Promise<Members | undefined>>
type TQueryMembers = Beast.Resolver<null, null, Promise<Members[]>>

export interface IMembersResolverMap extends Beast.IResolvers {
  Member: {
    profile: TResolverMemberProfile
    posts: TResolverMemberPosts
    teams: TResolverMemberTeams
  }
  Query: {
    member: TQueryMember
    members: TQueryMembers
  }
}
