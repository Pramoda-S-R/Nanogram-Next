import { ObjectId } from "mongodb";

export type Position = [number, number, number];

export interface Point {
  idx: number;
  position: Position;
  color: string;
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