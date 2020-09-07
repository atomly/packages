import { Members } from './Members';
import { Posts } from './Posts';
import { Profiles } from './Profiles';
import { Teams } from './Teams';
import { Users } from './Users';

export type Entity = typeof Members | typeof Posts | typeof Profiles | typeof Teams | typeof Users;
