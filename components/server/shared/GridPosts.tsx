import PostStats from "@/components/client/shared/PostStats";
import { AggregatePost } from "@/types";
import { SquareActivity } from "lucide-react";
import Link from "next/link";
import React from "react";

const GridPosts = ({
  posts,
  showUser = true,
  showStats = true,
}: {
  posts: AggregatePost[];
  showUser?: boolean;
  showStats?: boolean;
}) => {
  return (
    <ul className="flex flex-wrap gap-2">
      {posts.map((post) => (
        <li
          key={post._id.toString()}
          className="relative mx-auto w-72 aspect-square"
        >
          {post.imageUrl ? (
            <div className="w-full h-full rounded-lg overflow-hidden">
              <Link href={`/posts/${post._id.toString()}`}>
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </Link>

              <div className="w-full bg-gradient-to-t from-base-200 absolute bottom-0 flex rounded-b-md">
                {showUser && (
                  <figure className="flex items-center justify-center min-w-10 h-10">
                    <img
                      src={post.creator.avatarUrl}
                      alt={post.creator.username}
                      className="size-6 rounded-full"
                    />
                  </figure>
                )}
                {showStats && (
                  <div className="w-full flex">
                    <PostStats post={post} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-base-200 w-full h-full rounded-lg">
              <Link href={`/posts/${post._id.toString()}`} className="w-full h-full flex p-2">
                <p className="text-sm"><SquareActivity className="inline" /> {post.caption}</p>
              </Link>
              <div className="w-full bg-gradient-to-t from-base-200 absolute bottom-0 flex rounded-b-md">
                {showUser && (
                  <figure className="flex items-center justify-center min-w-10 h-10">
                    <img
                      src={post.creator.avatarUrl}
                      alt={post.creator.username}
                      className="size-6 rounded-full"
                    />
                  </figure>
                )}
                {showStats && (
                  <div className="w-full flex">
                    <PostStats post={post} />
                  </div>
                )}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default GridPosts;
