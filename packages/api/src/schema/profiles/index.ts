// Libraries
import { Members, Profiles } from '@beast/beast-entities';

// Types
import { IProfilesResolverMap } from './types';

const resolvers: IProfilesResolverMap = {
  Profile: {
    async member(parent, _, { loaders }): Promise<Members> {
      const member = await loaders.Members.oneLoaderByProfileId.load(String(parent.id));
      return member;
    },
  },
  Query: {
    async profile(_, { input }, { database }): Promise<Profiles | undefined> {
      const profile = await database.connection.getRepository(Profiles).findOne({
        where: { id: +input.id },
      });
      return profile;  
    },
  },
}

export default resolvers;
