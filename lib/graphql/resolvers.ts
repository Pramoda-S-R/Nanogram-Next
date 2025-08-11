import { ObjectId } from "mongodb";
import { Resolvers } from "./generated";
import { User as UserModel } from "@/types/graphql";
import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom Date scalar",
  serialize(value: unknown) {
    return value instanceof Date ? value.toISOString() : null;
  },
  parseValue(value: unknown) {
    return typeof value === "string" ? new Date(value) : null;
  },
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? new Date(ast.value) : null;
  },
});

const objectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "MongoDB ObjectId scalar",
  serialize(value: unknown) {
    return value instanceof ObjectId ? value.toHexString() : value;
  },
  parseValue(value: unknown) {
    return typeof value === "string" ? new ObjectId(value) : null;
  },
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? new ObjectId(ast.value) : null;
  },
});

export const resolvers: Resolvers = {
  Date: dateScalar,
  ObjectId: objectIdScalar,

  User: {
    _id: (parent) => parent._id,
    avatarUrl: (parent) => parent.avatarUrl,
    bio: (parent) => parent.bio,
    comments: (parent) => parent.comments,
    createdAt: (parent) => parent.createdAt,
    email: (parent) => parent.email,
    firstName: (parent) => parent.firstName,
    followers: (parent) => parent.followers,
    following: (parent) => parent.following,
    fullName: (parent) => parent.fullName,
    karma: (parent) => parent.karma,
    lastName: (parent) => parent.lastName,
    likedComments: (parent) => parent.likedComments,
    likedPosts: (parent) => parent.likedPosts,
    posts: (parent) => parent.posts,
    role: (parent) => parent.role,
    savedPosts: (parent) => parent.savedPosts,
    updatedAt: (parent) => parent.updatedAt,
    userId: (parent) => parent.userId,
    username: (parent) => parent.username,
  },

  Query: {
    users: async (_, __, ctx) => {
      const users = await ctx.db.collection<UserModel>("user").find().toArray();
      return users.map((u) => ({
        ...u,
        avatarUrl: u.avatarUrl ?? null,
        bio: u.bio ?? null,
        karma: u.karma ?? null,
        role: u.role ?? null,
        posts: u.posts ?? [],
        likedPosts: u.likedPosts ?? [],
        savedPosts: u.savedPosts ?? [],
        following: u.following ?? [],
        followers: u.followers ?? [],
        comments: u.comments ?? [],
        likedComments: u.likedComments ?? [],
      }));
    },

    user: async (_, { userId }, ctx) => {
      const user = await ctx.db
        .collection<UserModel>("user")
        .findOne({ userId });
      if (!user) return null;
      return {
        ...user,
        avatarUrl: user.avatarUrl ?? null,
        bio: user.bio ?? null,
        karma: user.karma ?? null,
        role: user.role ?? null,
        posts: user.posts ?? [],
        likedPosts: user.likedPosts ?? [],
        savedPosts: user.savedPosts ?? [],
        following: user.following ?? [],
        followers: user.followers ?? [],
        comments: user.comments ?? [],
        likedComments: user.likedComments ?? [],
      };
    },
  },

  Mutation: {
    createUser: async (_, args, ctx) => {
      const newUser: UserModel = {
        _id: new ObjectId(),
        userId: args.userId,
        username: args.username,
        firstName: args.firstName,
        lastName: args.lastName,
        fullName: args.fullName,
        email: args.email,
        bio: args.bio ?? null,
        avatarUrl: args.avatarUrl ?? null,
        karma: 0,
        role: "user",
        posts: [],
        likedPosts: [],
        savedPosts: [],
        following: [],
        followers: [],
        comments: [],
        likedComments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await ctx.db.collection<UserModel>("user").insertOne(newUser);
      return newUser;
    },
  },
};
