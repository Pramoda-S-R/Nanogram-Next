import PostStats from "@/components/client/shared/PostStats";
import { AggregatePost } from "@/types";
import React from "react";

const PostCard = ({ post }: { post: AggregatePost }) => {
  return (
    <div className="card bg-base-200 w-96 shadow-sm">
      <div className="card-body">
        <div className="flex items-center gap-2">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={post.creator.avatarUrl || "/assets/images/placeholder.png"}
                alt="User Avatar"
              />
            </div>
          </div>
          <div>
            <h2 className="card-title">
              {post.creator.firstName} {post.creator.lastName}
            </h2>
            <p className="text-xs">@{post.creator.username}</p>
          </div>
        </div>
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
      <figure>
        <img
          src={post.imageUrl || "/assets/images/placeholder.png"}
          alt={post._id.toString()}
        />
      </figure>
      <PostStats post={post} />
    </div>
  );
};

export default PostCard;
