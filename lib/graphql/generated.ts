import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '@/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date; output: Date; }
  ObjectId: { input: import('mongodb').ObjectId; output: import('mongodb').ObjectId; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createNewUser: User;
};


export type MutationCreateNewUserArgs = {
  avatarUrl: InputMaybe<Scalars['String']['input']>;
  bio: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Nanogram = {
  __typename?: 'Nanogram';
  _id: Scalars['ObjectId']['output'];
  alumini: Scalars['Boolean']['output'];
  avatarId: Maybe<Scalars['String']['output']>;
  avatarUrl: Maybe<Scalars['String']['output']>;
  content: Maybe<Scalars['String']['output']>;
  core: Scalars['Boolean']['output'];
  github: Maybe<Scalars['String']['output']>;
  instagram: Maybe<Scalars['String']['output']>;
  linkedin: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type PaginatedNanogram = {
  __typename?: 'PaginatedNanogram';
  items: Array<Nanogram>;
  pageInfo: PageInfo;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  items: Array<User>;
  pageInfo: PageInfo;
};

export type Query = {
  __typename?: 'Query';
  nanogram: Maybe<Nanogram>;
  nanograms: PaginatedNanogram;
  user: Maybe<User>;
  users: PaginatedUsers;
};


export type QueryNanogramArgs = {
  _id: InputMaybe<Scalars['ObjectId']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
};


export type QueryNanogramsArgs = {
  _idArray: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  after: InputMaybe<Scalars['String']['input']>;
  alumini: InputMaybe<Scalars['Boolean']['input']>;
  core: InputMaybe<Scalars['Boolean']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  order: InputMaybe<SortOrder>;
  sort: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  _id: InputMaybe<Scalars['ObjectId']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  userId: InputMaybe<Scalars['String']['input']>;
  username: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersArgs = {
  _idArray: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  order: InputMaybe<SortOrder>;
  role: InputMaybe<UserRole>;
  sort: InputMaybe<Scalars['String']['input']>;
  userId: InputMaybe<Scalars['String']['input']>;
  username: InputMaybe<Scalars['String']['input']>;
};

export type SortOrder =
  | 'ASC'
  | 'DESC';

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId']['output'];
  avatarUrl: Maybe<Scalars['String']['output']>;
  bio: Maybe<Scalars['String']['output']>;
  comments: Maybe<Array<Scalars['ObjectId']['output']>>;
  createdAt: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  followers: Maybe<Array<Scalars['ObjectId']['output']>>;
  following: Maybe<Array<Scalars['ObjectId']['output']>>;
  fullName: Scalars['String']['output'];
  karma: Maybe<Scalars['Int']['output']>;
  lastName: Scalars['String']['output'];
  likedComments: Maybe<Array<Scalars['ObjectId']['output']>>;
  likedPosts: Maybe<Array<Scalars['ObjectId']['output']>>;
  posts: Maybe<Array<Scalars['ObjectId']['output']>>;
  role: Maybe<UserRole>;
  savedPosts: Maybe<Array<Scalars['ObjectId']['output']>>;
  updatedAt: Scalars['Date']['output'];
  userId: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserRole =
  | 'admin'
  | 'dev'
  | 'moderator'
  | 'user';



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

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

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Nanogram: ResolverTypeWrapper<Nanogram>;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']['output']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginatedNanogram: ResolverTypeWrapper<PaginatedNanogram>;
  PaginatedUsers: ResolverTypeWrapper<PaginatedUsers>;
  Query: ResolverTypeWrapper<{}>;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Nanogram: Nanogram;
  ObjectId: Scalars['ObjectId']['output'];
  PageInfo: PageInfo;
  PaginatedNanogram: PaginatedNanogram;
  PaginatedUsers: PaginatedUsers;
  Query: {};
  String: Scalars['String']['output'];
  User: User;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createNewUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateNewUserArgs, 'email' | 'firstName' | 'fullName' | 'lastName' | 'userId' | 'username'>>;
};

export type NanogramResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Nanogram'] = ResolversParentTypes['Nanogram']> = {
  _id: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  alumini: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  avatarId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatarUrl: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  core: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  github: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  instagram: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  linkedin: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priority: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  role: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectId'], any> {
  name: 'ObjectId';
}

export type PageInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedNanogramResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PaginatedNanogram'] = ResolversParentTypes['PaginatedNanogram']> = {
  items: Resolver<Array<ResolversTypes['Nanogram']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedUsersResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PaginatedUsers'] = ResolversParentTypes['PaginatedUsers']> = {
  items: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  nanogram: Resolver<Maybe<ResolversTypes['Nanogram']>, ParentType, ContextType, QueryNanogramArgs>;
  nanograms: Resolver<ResolversTypes['PaginatedNanogram'], ParentType, ContextType, QueryNanogramsArgs>;
  user: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, QueryUserArgs>;
  users: Resolver<ResolversTypes['PaginatedUsers'], ParentType, ContextType, QueryUsersArgs>;
};

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  avatarUrl: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comments: Resolver<Maybe<Array<ResolversTypes['ObjectId']>>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followers: Resolver<Maybe<Array<ResolversTypes['ObjectId']>>, ParentType, ContextType>;
  following: Resolver<Maybe<Array<ResolversTypes['ObjectId']>>, ParentType, ContextType>;
  fullName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  karma: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  lastName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  likedComments: Resolver<Maybe<Array<ResolversTypes['ObjectId']>>, ParentType, ContextType>;
  likedPosts: Resolver<Maybe<Array<ResolversTypes['ObjectId']>>, ParentType, ContextType>;
  posts: Resolver<Maybe<Array<ResolversTypes['ObjectId']>>, ParentType, ContextType>;
  role: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType>;
  savedPosts: Resolver<Maybe<Array<ResolversTypes['ObjectId']>>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  userId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  Date: GraphQLScalarType;
  Mutation: MutationResolvers<ContextType>;
  Nanogram: NanogramResolvers<ContextType>;
  ObjectId: GraphQLScalarType;
  PageInfo: PageInfoResolvers<ContextType>;
  PaginatedNanogram: PaginatedNanogramResolvers<ContextType>;
  PaginatedUsers: PaginatedUsersResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  User: UserResolvers<ContextType>;
};

