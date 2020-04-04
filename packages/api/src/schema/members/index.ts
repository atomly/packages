// Libraries
import { Members, Posts } from '@beast/beast-entities';

// Types
import { IMembersResolverMap } from './types';

const resolvers: IMembersResolverMap = {
  Member: {
    async posts(parent, _, { loaders }): Promise<Posts[]> {
      const posts = await loaders.Posts.manyLoaderByMemberIds.load(String(parent.id));
      return posts;
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
