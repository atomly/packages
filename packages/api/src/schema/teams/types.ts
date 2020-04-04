// Libraries
import { Beast, GQL } from '@root/types/index';
import { Teams, Members } from '@beast/beast-entities';
import { IThrowError } from '@utils/throwError/errors'

// Team resolvers
type TResolverTeamMembers = Beast.Resolver<Teams, null, Promise<Members[]>>

type TQueryTeam = Beast.Resolver<null, GQL.QueryTeamArgs, Promise<Teams | undefined>>
type TQueryTeams = Beast.Resolver<null, null, Promise<Teams[]>>

type TMutationNewTeams= Beast.Resolver<null, GQL.MutationNewTeamArgs, Promise<Teams | IThrowError>>
type TMutationUpdateTeams= Beast.Resolver<null, GQL.MutationUpdateTeamArgs, Promise<Teams | IThrowError>>

export interface ITeamsResolverMap extends Beast.IResolvers {
  Team: {
    members: TResolverTeamMembers
  }
  Query: {
    team: TQueryTeam
    teams: TQueryTeams
  }
  Mutation: {
    newTeam: TMutationNewTeams
    updateTeam: TMutationUpdateTeams
  }
}
