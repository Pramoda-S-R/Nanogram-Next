import { BlogPost } from "../mongodb";

export interface Blog {
  id: string | number;
  version: number;
  score: number;
  payload?: BlogPost;
  vector?:
    | Record<string, unknown>
    | number[]
    | number[][]
    | {
        [key: string]:
          | number[]
          | number[][]
          | {
              indices: number[];
              values: number[];
            }
          | undefined;
      }
    | null
    | undefined;
  shard_key?: string | number | Record<string, unknown> | null | undefined;
  order_value?: number | Record<string, unknown> | null | undefined;
}
