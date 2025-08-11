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
