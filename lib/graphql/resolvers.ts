import { ObjectId } from "mongodb";
import { Resolvers } from "./generated";
import { Nanogram, Posts, User as UserModel } from "@/types/graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { requireRole } from "./authContext";

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

  PageInfo: {
    endCursor: (parent) => parent.endCursor,
    hasNextPage: (parent) => parent.hasNextPage,
  },

  PaginatedUsers: {
    items: (parent) => parent.items,
    pageInfo: (parent) => parent.pageInfo,
  },

  PaginatedNanogram: {
    items: (parent) => parent.items,
    pageInfo: (parent) => parent.pageInfo,
  },

  PaginatedPosts: {
    items: (parent) => parent.items,
    pageInfo: (parent) => parent.pageInfo,
  },

  Nanogram: {
    _id: (parent) => parent._id,
    name: (parent) => parent.name,
    role: (parent) => parent.role,
    content: (parent) => parent.content,
    avatarId: (parent) => parent.avatarId,
    avatarUrl: (parent) => parent.avatarUrl,
    linkedin: (parent) => parent.linkedin,
    github: (parent) => parent.github,
    instagram: (parent) => parent.instagram,
    alumini: (parent) => parent.alumini,
    core: (parent) => parent.core,
    priority: (parent) => {
      const value = parent.priority;
      if (value == null) return 0; // default if null/undefined
      const num = Number(value);
      return Number.isInteger(num) ? num : 0; // ensure it's an integer
    },
  },

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

  Post: {
    _id: (parent) => parent._id,
    creator: (parent) => parent.creator,
    caption: (parent) => parent.caption,
    tags: (parent) => parent.tags,
    imageId: (parent) => parent.imageId,
    imageUrl: (parent) => parent.imageUrl,
    source: (parent) => parent.source,
    savedBy: (parent) => parent.savedBy,
    likes: (parent) => parent.likes,
    comments: (parent) => parent.comments,
    createdAt: (parent) => parent.createdAt,
    updatedAt: (parent) => parent.updatedAt,
  },

  Query: {
    users: async (_, args, ctx) => {
      const filter: any = {};

      if (args.userId) filter.userId = args.userId;
      if (args.username) filter.username = args.username;
      if (args.role) filter.role = args.role;
      if (args._idArray && args._idArray.length > 0) {
        filter._id = {
          $in: args._idArray,
        };
      }
      if (args.name) {
        const nameRegex = new RegExp(args.name, "i"); // case-insensitive
        filter.$or = [
          { firstName: nameRegex },
          { lastName: nameRegex },
          { username: nameRegex },
        ];
      }
      if (args.after) {
        filter._id = { ...(filter._id || {}), $gt: new ObjectId(args.after) };
      }

      let cursor = ctx.db.collection<UserModel>("user").find(filter);
      if (args.sort) {
        const sortOrder = args.order === "ASC" ? 1 : -1;
        cursor = cursor.sort({ [args.sort]: sortOrder });
      }
      if (args.first) {
        cursor.limit(args.first + 1);
      }

      const users = await cursor.toArray();

      let hasNextPage: boolean = false;
      if (args.first) {
        hasNextPage = users.length > args.first;
      }

      const items = users.map((u) => ({
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
      return {
        items: args.first ? items.slice(0, args.first) : items,
        pageInfo: {
          endCursor:
            items.length > 0
              ? hasNextPage
                ? items[items.length - 2]._id.toString()
                : items[items.length - 1]._id.toString()
              : null,
          hasNextPage,
        },
      };
    },

    user: async (_, args, ctx) => {
      const filter: any = {};

      if (args.userId) filter.userId = args.userId;
      if (args.username) filter.username = args.username;
      if (args._id) filter._id = args._id; // args._id would already be ObjectId type
      if (args.name) {
        const nameRegex = new RegExp(args.name, "i"); // case-insensitive
        filter.$or = [
          { firstName: nameRegex },
          { lastName: nameRegex },
          { username: nameRegex },
        ];
      }

      if (Object.keys(filter).length === 0) {
        throw new Error("At least one filter parameter must be provided");
      }

      const user = await ctx.db.collection<UserModel>("user").findOne(filter);
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
    nanograms: async (_, args, ctx) => {
      const filter: any = {};

      if (args._idArray && args._idArray.length > 0) {
        filter._id = {
          $in: args._idArray,
        };
      }
      if (args.name) {
        const nameRegex = new RegExp(args.name, "i"); // case-insensitive
        filter.$or = [
          { firstName: nameRegex },
          { lastName: nameRegex },
          { username: nameRegex },
        ];
      }
      if (args.alumini) filter.alumini = args.alumini;
      if (args.core) filter.core = args.core;
      if (args.after) {
        filter._id = { ...(filter._id || {}), $gt: new ObjectId(args.after) };
      }

      let cursor = ctx.db.collection<Nanogram>("nanogram").find(filter);
      if (args.sort) {
        const sortOrder = args.order === "ASC" ? 1 : -1;
        cursor = cursor.sort({ [args.sort]: sortOrder });
      }
      if (args.first) {
        cursor.limit(args.first + 1);
      }

      const nanogram = await cursor.toArray();

      let hasNextPage: boolean = false;
      if (args.first) {
        hasNextPage = nanogram.length > args.first;
      }
      const items = nanogram.map((n) => ({
        ...n,
        content: n.content ?? null,
        avatarId: n.avatarId ?? null,
        avatarUrl: n.avatarUrl ?? null,
        linkedin: n.linkedin ?? null,
        github: n.github ?? null,
        instagram: n.instagram ?? null,
        alumini: n.alumini ?? null,
        core: n.core ?? null,
        priority: n.priority ?? null,
      }));
      return {
        items: args.first ? items.slice(0, args.first) : items,
        pageInfo: {
          endCursor:
            items.length > 0
              ? hasNextPage
                ? items[items.length - 2]._id.toString()
                : items[items.length - 1]._id.toString()
              : null,
          hasNextPage,
        },
      };
    },
    nanogram: async (_, args, ctx) => {
      const filter: any = {};

      if (args._id) filter._id = args._id; // args._id would already be ObjectId type
      if (args.name) {
        filter.$or = [{ name: { $regex: args.name, $options: "i" } }];
      }

      if (Object.keys(filter).length === 0) {
        throw new Error("At least one filter parameter must be provided");
      }

      const nanogram = await ctx.db
        .collection<Nanogram>("nanogram")
        .findOne(filter);
      if (!nanogram) return null;
      return {
        ...nanogram,
        content: nanogram.content ?? null,
        avatarId: nanogram.avatarId ?? null,
        avatarUrl: nanogram.avatarUrl ?? null,
        linkedin: nanogram.linkedin ?? null,
        github: nanogram.github ?? null,
        instagram: nanogram.instagram ?? null,
        alumini: nanogram.alumini ?? null,
        core: nanogram.core ?? null,
        priority: nanogram.priority ?? null,
      };
    },
    posts: async (_, args, ctx) => {
      const filter: any = {};

      if (args._idArray && args._idArray.length > 0) {
        filter._id = {
          $in: args._idArray,
        };
      }
      if (args.creator) filter.creator = args.creator;
      if (args.after) {
        filter._id = { ...(filter._id || {}), $gt: new ObjectId(args.after) };
      }

      let cursor = ctx.db.collection<Posts>("posts").find(filter);
      if (args.sort) {
        const sortOrder = args.order === "ASC" ? 1 : -1;
        cursor = cursor.sort({ [args.sort]: sortOrder });
      }
      if (args.first) {
        cursor.limit(args.first + 1);
      }

      const posts = await cursor.toArray();

      let hasNextPage: boolean = false;
      if (args.first) {
        hasNextPage = posts.length > args.first;
      }

      const postItems = posts.slice(0, args.first ? args.first : undefined);

      const userIds = [
        ...new Set(postItems.map((p) => p.creator.toHexString())),
      ].map((idStr) => new ObjectId(idStr));

      const users = await ctx.db
        .collection<UserModel>("user")
        .find({ _id: { $in: userIds } })
        .toArray();

      const userMap = new Map(users.map((u) => [u._id.toHexString(), u]));

      const items = postItems.map((p) => {
        const user = userMap.get(p.creator.toHexString());
        if (!user)
          throw new Error(`User not found for id ${p.creator.toString()}`);
        return {
          ...p,
          creator: user,
        };
      });

      return {
        items: items,
        pageInfo: {
          endCursor:
            items.length > 0 ? items[items.length - 1]._id.toString() : null,
          hasNextPage,
        },
      };
    },
    post: async (_, args, ctx) => {
      const filter: any = {};

      if (args._id) filter._id = args._id; // args._id would already be ObjectId type

      if (Object.keys(filter).length === 0) {
        throw new Error("At least one filter parameter must be provided");
      }

      const post = await ctx.db.collection<Posts>("posts").findOne(filter);
      if (!post) return null;
      const user = await ctx.db
        .collection<UserModel>("user")
        .findOne({ _id: post.creator });
      if (!user) return null;
      return {
        ...post,
        creator: user,
      };
    },
  },

  Mutation: {
    createNewUser: async (_, args, ctx) => {
      requireRole(ctx.dev, ["admin"]);

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
