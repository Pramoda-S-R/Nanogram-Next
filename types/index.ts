import { ObjectId } from "mongodb";

export type Position = [number, number, number];

export interface Point {
  idx: number;
  position: Position;
  color: string;
}

export interface UploadedFile {
  onFileChange: (file: File | null) => void;
  initialFileUrl?: string;
  acceptedFileTypes?: Record<string, string[]>;
  enableImageCropping?: boolean;
  cropAspectRatio?: number;
  cropperStyle?: React.CSSProperties;
}

export interface BlogSchema {
  title: string;
  desc: string;
  publishedAt: Date;
  authors: string[];
  tags: string[];
  cover?: string;
  file?: File;
  key?: string;
}

export interface AggregatePost {
  _id: ObjectId;
  creator: User;
  caption: string;
  tags: string[];
  imageId: string;
  imageUrl: string;
  source: string;
  savedBy: ObjectId[];
  likes: ObjectId[];
  comments: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Aggregateuser {
  _id: ObjectId;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  karma?: number;
  role?: "user" | "admin" | "moderator" | "dev"; // For cool badges
  posts?: Post[];
  likedPosts?: ObjectId[];
  savedPosts?: ObjectId[];
  following?: ObjectId[];
  followers?: ObjectId[];
  comments?: ObjectId[];
  likedComments?: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// MongoDB Schemas of various collections used in the application
export interface Nanogram {
  _id: ObjectId;
  name: string;
  role: string;
  content?: string;
  avatarId?: string;
  avatarUrl?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  alumini?: boolean;
  core?: boolean;
  priority?: number;
}

export interface Testimonial {
  _id: ObjectId;
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
}

export interface Event {
  _id: ObjectId;
  imageUrl?: string;
  title: string;
  subtitle?: string;
  description: string;
  content?: string;
  date: Date;
  location?: string;
  registration?: string;
  completed?: boolean;
}

export interface User {
  _id: ObjectId;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  karma?: number;
  role?: "user" | "admin" | "moderator" | "dev"; // For cool badges
  posts?: ObjectId[];
  likedPosts?: ObjectId[];
  savedPosts?: ObjectId[];
  following?: ObjectId[];
  followers?: ObjectId[];
  comments?: ObjectId[];
  likedComments?: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  _id: ObjectId;
  creator: ObjectId;
  caption: string;
  tags: string[];
  imageId: string;
  imageUrl: string;
  source: string;
  savedBy: ObjectId[];
  likes: ObjectId[];
  comments: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: ObjectId;
  postId: ObjectId;
  commenter: ObjectId;
  content: string;
  likes: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  _id: ObjectId;
  title: string;
  desc: string;
  publishedAt: Date;
  authors: string[];
  tags: string[];
  cover?: string;
  route?: string;
  fileUrl: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Newsletters {
  _id: ObjectId;
  title: string;
  publishedAt: Date;
  fileUrl: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}
