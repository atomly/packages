import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthenticateInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type FindMemberInput = {
  id: Scalars['ID'];
};

export type FindTeamInput = {
  id: Scalars['ID'];
};

export type FindUserInput = {
  id: Scalars['ID'];
};

export type Member = {
   __typename?: 'Member';
  id: Scalars['ID'];
  posts?: Maybe<Array<Maybe<Post>>>;
};

export type Mutation = {
   __typename?: 'Mutation';
  newPost?: Maybe<Post>;
  newTeam?: Maybe<Team>;
  updateTeam?: Maybe<Team>;
  newUser?: Maybe<User>;
  authenticate?: Maybe<User>;
  logout: Scalars['Boolean'];
};


export type MutationNewPostArgs = {
  input: NewPostInput;
};


export type MutationNewTeamArgs = {
  input: NewTeamInput;
};


export type MutationUpdateTeamArgs = {
  input: UpdateTeamInput;
};


export type MutationNewUserArgs = {
  input: NewUserInput;
};


export type MutationAuthenticateArgs = {
  input: AuthenticateInput;
};

export type NewPostInput = {
  memberId: Scalars['ID'];
  header: Scalars['String'];
  body: Scalars['String'];
};

export type NewTeamInput = {
  createdBy: Scalars['ID'];
};

export type NewUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Post = {
   __typename?: 'Post';
  id: Scalars['ID'];
  memberId: Scalars['ID'];
  header?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
};

export type Query = {
   __typename?: 'Query';
  members?: Maybe<Array<Maybe<Member>>>;
  member?: Maybe<Member>;
  posts?: Maybe<Array<Maybe<Post>>>;
  post?: Maybe<Post>;
  test: Scalars['String'];
  ping: Scalars['String'];
  teams?: Maybe<Array<Maybe<Team>>>;
  team?: Maybe<Team>;
  users?: Maybe<Array<Maybe<User>>>;
  user?: Maybe<User>;
  me?: Maybe<User>;
};


export type QueryMemberArgs = {
  input: FindMemberInput;
};


export type QueryPostArgs = {
  id: Scalars['ID'];
};


export type QueryTeamArgs = {
  input: FindTeamInput;
};


export type QueryUserArgs = {
  input: FindUserInput;
};

export type Subscription = {
   __typename?: 'Subscription';
  newPostSubscription: Post;
  hello: Scalars['String'];
};


export type SubscriptionHelloArgs = {
  name: Scalars['String'];
};

export type Team = {
   __typename?: 'Team';
  id: Scalars['ID'];
  members?: Maybe<Array<Maybe<Member>>>;
};

export type UpdateTeamInput = {
  id: Scalars['ID'];
  newMember: Scalars['ID'];
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['ID'];
  memberId: Scalars['ID'];
  member?: Maybe<Member>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  Member: ResolverTypeWrapper<Member>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Post: ResolverTypeWrapper<Post>,
  String: ResolverTypeWrapper<Scalars['String']>,
  FindMemberInput: FindMemberInput,
  Team: ResolverTypeWrapper<Team>,
  FindTeamInput: FindTeamInput,
  User: ResolverTypeWrapper<User>,
  FindUserInput: FindUserInput,
  Mutation: ResolverTypeWrapper<{}>,
  NewPostInput: NewPostInput,
  NewTeamInput: NewTeamInput,
  UpdateTeamInput: UpdateTeamInput,
  NewUserInput: NewUserInput,
  AuthenticateInput: AuthenticateInput,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Subscription: ResolverTypeWrapper<{}>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  Member: Member,
  ID: Scalars['ID'],
  Post: Post,
  String: Scalars['String'],
  FindMemberInput: FindMemberInput,
  Team: Team,
  FindTeamInput: FindTeamInput,
  User: User,
  FindUserInput: FindUserInput,
  Mutation: {},
  NewPostInput: NewPostInput,
  NewTeamInput: NewTeamInput,
  UpdateTeamInput: UpdateTeamInput,
  NewUserInput: NewUserInput,
  AuthenticateInput: AuthenticateInput,
  Boolean: Scalars['Boolean'],
  Subscription: {},
};

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  newPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationNewPostArgs, 'input'>>,
  newTeam?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<MutationNewTeamArgs, 'input'>>,
  updateTeam?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<MutationUpdateTeamArgs, 'input'>>,
  newUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationNewUserArgs, 'input'>>,
  authenticate?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationAuthenticateArgs, 'input'>>,
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  memberId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  header?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['Member']>>>, ParentType, ContextType>,
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMemberArgs, 'input'>>,
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>,
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>,
  test?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  teams?: Resolver<Maybe<Array<Maybe<ResolversTypes['Team']>>>, ParentType, ContextType>,
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<QueryTeamArgs, 'input'>>,
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'input'>>,
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  newPostSubscription?: SubscriptionResolver<ResolversTypes['Post'], "newPostSubscription", ParentType, ContextType>,
  hello?: SubscriptionResolver<ResolversTypes['String'], "hello", ParentType, ContextType, RequireFields<SubscriptionHelloArgs, 'name'>>,
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['Member']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  memberId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = any> = {
  Member?: MemberResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Post?: PostResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  Team?: TeamResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
