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
  _id: ObjectId,
  name: string,
  role: string,
  content: string,
  avatarUrl: string,
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