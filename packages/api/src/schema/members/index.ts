// Libraries
import { Members, Posts, Profiles } from '@beast/beast-entities';

// Types
import { IMembersResolverMap } from './types';

const resolvers: IMembersResolverMap = {
  Member: {
    async posts(parent, _, { loaders }): Promise<Posts[]> {
      const posts = await loaders.Posts.limittedManyLoader.load(String(parent.id));
      return posts;
    },
    async profile(parent, _, { loaders }): Promise<Profiles> {
      const profile = await loaders.Profiles.oneLoader.load(String(parent.profileId));
      loaders.Profiles.oneLoader.clearAll();
      return profile;
    },
  },
  Query: {
    async member(_, { input }, { database }): Promise<Members | undefined> {
      const member = await database.connection.getRepository(Members).findOne({
        where: { id: +input.id },
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
