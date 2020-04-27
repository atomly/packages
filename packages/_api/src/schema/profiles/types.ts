// Libraries
import { Beast, GQL } from '@root/types/index';
import { Profiles, Members } from '@beast/beast-entities';

// Profile resolvers
type TResolverProfileMember = Beast.Resolver<Profiles, null, Promise<Members>>

type TQueryProfile = Beast.Resolver<null, GQL.QueryProfileArgs, Promise<Profiles | undefined>>

export interface IProfilesResolverMap extends Beast.IResolvers {
  Profile: {
    member: TResolverProfileMember
  }
  Query: {
    profile: TQueryProfile
  }
}
