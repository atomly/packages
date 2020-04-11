// Types
import { IMembersLoaders } from './Members/types';
import { IPostsLoaders } from './Posts/types';
import { IProfilesLoaders } from './Profiles/types';
import { ITeamsLoaders } from './Teams/types';
import { IUsersLoaders } from './Users/types';

export interface IEntityLoaders {
  Members: IMembersLoaders
  Posts: IPostsLoaders
  Profiles: IProfilesLoaders
  Teams: ITeamsLoaders
  Users: IUsersLoaders
}
