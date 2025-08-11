import PostActions from "@/components/client/shared/PostActions";
import PostCreator from "@/components/client/shared/PostCreator";
import PostStats from "@/components/client/shared/PostStats";
import { AggregatePost } from "@/types";
import { User } from "@/types/mongodb";
import { timeAgo } from "@/utils";
import Link from "next/link";
import React from "react";

const PostCard = async ({
  post,
  user,
}: {
  post: AggregatePost;
  user: User;
}) => {
  return (
    <div className="card bg-base-200 md:w-96 w-full shadow-sm">
      <div className="card-body">
        <div className="flex justify-between">
          <PostCreator creator={post.creator} />
          <PostActions post={post} user={user} />
        </div>
        <p className="text-xs text-base-content/30">
          Posted on {post.source}, {timeAgo(post.createdAt.toString())}
        </p>
        <p className="">{post.caption || "No caption provided."}</p>
        <ul className="flex flex-wrap gap-1 mt-1">
          {post.tags.length === 0
            ? null
            : post.tags.map((tag) => (
                <li key={tag} className="text-primary font-light">
                  #{tag}
                </li>
              ))}
        </ul>
      </div>
      {post.imageUrl && (
        <Link href={`/posts/${post._id.toString()}`}>
          <figure>
            <img
              src={post.imageUrl || "/assets/images/placeholder.png"}
              alt={post._id.toString()}
            />
          </figure>
        </Link>
      )}
      <PostStats post={post} user={user} align="between" />
    </div>
  );
};

export default PostCard;
