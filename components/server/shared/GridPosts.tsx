import PostStats from "@/components/client/shared/PostStats";
import { AggregatePost } from "@/types";
import { User } from "@/types/mongodb";
import { SquareActivity } from "lucide-react";
import Link from "next/link";
import React from "react";

const GridPosts = ({
  posts,
  user,
  showUser = true,
  showStats = true,
}: {
  posts: AggregatePost[];
  user?: User;
  showUser?: boolean;
  showStats?: boolean;
}) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-base-content/50">
        No posts found.
      </div>
    );
  }
  return (
    <ul className="flex flex-wrap md:justify-start justify-center gap-2">
      {posts.map((post) => (
        <li key={post._id.toString()} className="relative w-72 aspect-square">
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

              {(showUser || showStats) && (
                <div className="w-full bg-gradient-to-t from-base-200 absolute bottom-0 flex rounded-b-md">
                  {showUser && (
                    <div className="flex items-center py-2">
                      <figure className="flex items-center justify-center min-w-10 h-10">
                        <img
                          src={post.creator.avatarUrl}
                          alt={post.creator.username}
                          className="size-6 rounded-full"
                        />
                      </figure>
                      <p className="text-base-content">
                        {post.creator.firstName}
                      </p>
                    </div>
                  )}
                  {showStats && user && (
                    <div className="w-full flex items-center">
                      <PostStats
                        post={post}
                        user={user}
                        showComments={false}
                        showShare={false}
                        align="end"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-base-200 w-full h-full rounded-lg">
              <Link
                href={`/posts/${post._id.toString()}`}
                className="w-full h-full flex p-2"
              >
                <p className="text-sm">
                  <SquareActivity className="inline" /> {post.caption}
                </p>
              </Link>
              <div className="w-full bg-gradient-to-t from-base-200 absolute bottom-0 flex rounded-b-md">
                {showUser && (
                  <div className="flex items-center py-2">
                    <figure className="flex items-center justify-center min-w-10 h-10">
                      <img
                        src={post.creator.avatarUrl}
                        alt={post.creator.username}
                        className="size-6 rounded-full"
                      />
                    </figure>

                    <p className="text-base-content">
                      {post.creator.firstName}
                    </p>
                  </div>
                )}
                {showStats && user && (
                  <div className="w-full flex items-center">
                    <PostStats
                      post={post}
                      user={user}
                      showComments={false}
                      showShare={false}
                      align="end"
                    />
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
