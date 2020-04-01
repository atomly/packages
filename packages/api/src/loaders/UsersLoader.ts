// Libraries
import DataLoader from 'dataloader';
import { Users } from '@beast/beast-entities';

// Dependencies
import { factory } from './factory';

export function UsersLoader(): DataLoader<string, Users, unknown> {
  return factory<Users>(Users);
}
