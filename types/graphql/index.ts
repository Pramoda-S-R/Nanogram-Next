import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  karma: number | null;
  role: "user" | "admin" | "moderator" | "dev" | null; // For cool badges
  comments: ObjectId[] | null;
  likedComments: ObjectId[] | null;
  posts: ObjectId[] | null;
  likedPosts: ObjectId[] | null;
  savedPosts: ObjectId[] | null;
  following: ObjectId[] | null;
  followers: ObjectId[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Nanogram {
  _id: ObjectId;
  name: string;
  role: string;
  content: string | null;
  avatarId: string | null;
  avatarUrl: string | null;
  linkedin: string | null;
  github: string | null;
  instagram: string | null;
  alumini: boolean;
  core: boolean;
  priority: number;
}