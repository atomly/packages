// Libraries
import DataLoader from 'dataloader';
import { Posts } from '@beast/beast-entities';

// Dependencies
import { factory } from './factory';

export function PostsLoader(): DataLoader<string, Posts, unknown> {
  return factory<Posts>(Posts);
}
