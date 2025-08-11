import { Db, MongoClient, ObjectId } from "mongodb";
import { CSSProperties, HTMLInputTypeAttribute } from "react";
import { Developers, User } from "@/types/mongodb";

export interface GraphQLContext {
  db: Db;
  mongoClient: MongoClient;
  dev: Developers;
  role: string;
  rateLimit: { limit: number; remaining: number; reset: number };
}

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
