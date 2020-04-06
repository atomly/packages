// Libraries
import { Members, Posts, Profiles, Teams } from '@beast/beast-entities';

// Types
import { IMembersResolverMap } from './types';

// Utils
import { isQueryingResolver } from '@root/utils';

const resolvers: IMembersResolverMap = {
  Member: {
    async posts(parent, _, { loaders }): Promise<Posts[]> {
      const posts = await loaders.Posts.limittedManyLoaderByMemberIds.load(String(parent.id));
      return posts;
    },
    async profile(parent, _, { loaders }): Promise<Profiles> {
      const profile = await loaders.Profiles.oneLoader.load(String(parent.profileId));
      loaders.Profiles.oneLoader.clearAll();
      return profile;
    },
    async teams(parent, _, { loaders }): Promise<Teams[]> {
      const response = await loaders.Teams.limittedManyLoader.loadMany(
        parent.teamsIds.map(id => String(id)),
      );
      const teams: Teams[] = response.reduce((acc: Teams[], val) =>
        acc.concat(val as Teams[]), [],
      );
      return teams;
    },
  },
  Query: {
    async member(_, { input }, { database }, info): Promise<Members | undefined> {
      const isQueryingTeams = isQueryingResolver(info, 'teams');
      const member = await database.connection.getRepository(Members).findOne({
        where: { id: +input.id },
        relations: isQueryingTeams ? ['teams'] : undefined,
      });
      return member;  
    },
    async members(_, __, { database }): Promise<Members[]> {
      const members = await database.connection.getRepository(Members).find();
      return members;
    },
  },
}

export default resolvers;
