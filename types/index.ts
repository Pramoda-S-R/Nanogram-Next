import { ObjectId } from "mongodb";
import { CSSProperties, HTMLInputTypeAttribute } from "react";

export type Position = [number, number, number];

// ========== VALIDATIONS ==========
export interface Validation {
  object: "length" | "regex" | "text" | "number";
  constraint: string;
  errorText: string;
}

export interface LongAnswerValidation extends Validation {
  object: "text" | "number";
}

// ========== FORMFIELDS ==========
export interface FormShortAnswer {
  type: "short_answer";
  inputType?: HTMLInputTypeAttribute;
  validation?: Validation;
}

export interface FromLongAnswer {
  type: "long_answer";
  validation?: LongAnswerValidation;
}

export interface FormMultipleChoice {
  type: "multiple_choice";
  options?: MultipleChoiceOption[];
  other?: boolean;
}

export interface FormCheckbox {
  type: "checkbox";
  options?: CheckboxOption[];
}

export interface FormDropdown {
  type: "dropdown";
  options?: string[];
}

export interface FormLinearScale {
  type: "linear_scale";
  high?: string;
  low?: string;
  start?: number;
  count?: number;
}

export interface FormRating {
  type: "rating";
  icon?: "star" | "heart" | "like";
  stroke?: CSSProperties["color"];
  fill?: CSSProperties["color"];
  count?: number;
}

export interface FormMultipleChoiceGrid {
  type: "multiple_choice_grid";
  table?: GridBaseObject;
}

export interface FormCheckboxGrid {
  type: "checkbox_grid";
  table?: GridBaseObject;
}

export interface FormDate {
  type: "date";
  includeTime?: boolean;
}

export interface FormTime {
  type: "time";
}

export interface FormFileUpload {
  type: "file_upload";
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}

// ========= FORM TYPES ==========
export interface MultipleChoiceOption {
  option: string;
  other: boolean;
}

export interface CheckboxOption extends MultipleChoiceOption {}

export interface GridBaseObject {
  rows: string[];
  columns: string[];
}

// ========== FORM ==========
export interface FormHeader {
  title: string;
  description?: string;
}

export interface FormField {
  title?: string;
  description?: string;
  required?: boolean;
  imageUrl?: string;
  config:
    | FormShortAnswer
    | FromLongAnswer
    | FormMultipleChoice
    | FormCheckbox
    | FormDropdown
    | FormLinearScale
    | FormRating
    | FormMultipleChoiceGrid
    | FormCheckboxGrid
    | FormDate
    | FormTime
    | FormFileUpload;
}

export interface FormObj {
  id: string;
  header: FormHeader;
  fields: FormField[];
}

// Types for various components and utilities used in the application

export interface Point {
  idx: number;
  position: Position;
  color: string;
}

export interface UploadedFile {
  onFileChange: (file: File | null) => void;
  imageStyles?: string;
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
  authorId: string;
  tags: string[];
  cover?: string;
  file?: File;
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

export interface AggregateComment {
  _id: ObjectId;
  postId: ObjectId;
  commenter: User;
  content: string;
  likes: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Messager {
  _id: ObjectId;
  username: string;
  fullName: string;
  avatarUrl?: string;
}

export interface SharedPost {
  _id: ObjectId;
  creator: Messager;
  caption: string;
  imageId: string;
  imageUrl: string;
  source: string;
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
  fullName: string;
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
  authorId: ObjectId;
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
  description: string;
  route: string;
  publishedAt: Date;
  fileUrl: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  _id: ObjectId;
  reporter: ObjectId;
  reportedUser: ObjectId;
  reportedMedia: "post" | "comment" | "blog";
  mediaId: ObjectId;
  reason: string;
  details?: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: ObjectId;
  sender: Messager;
  receiver: Messager;
  message: string | SharedPost;
  reactions?: {
    emoji: string;
    userId: ObjectId;
  }[];
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
