import { PostsLoader } from './PostsLoader';
import { UsersLoader } from './UsersLoader';

export const loaders = {
  postLoader: PostsLoader(),
  userLoader: UsersLoader(),
};
