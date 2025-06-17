import PostActions from "@/components/client/shared/PostActions";
import PostCreator from "@/components/client/shared/PostCreator";
import PostStats from "@/components/client/shared/PostStats";
import { AggregatePost, User } from "@/types";
import { timeAgo } from "@/utils";
import React from "react";

const PostDetails = ({ post, user }: { post: AggregatePost; user: User }) => {
  return (
    <div className="w-full bg-base-200 flex flex-wrap rounded-lg overflow-hidden">
      <figure className="md:w-1/2 w-full flex">
        <img
          src={post.imageUrl || "/assets/images/placeholder.png"}
          alt={post.imageId || "post"}
          className="object-cover"
        />
      </figure>
      <div className="md:w-1/2 w-full h-full flex flex-col justify-between aspect-square px-2">
        <div className="md:overflow-y-auto">
          <div className="sticky top-0 bg-base-200 flex justify-between py-2">
            <PostCreator creator={post.creator} />
            <PostActions post={post} user={user} />
          </div>
          <p className="text-xs text-base-content/30">
            Posted on {post.source}, {timeAgo(post.createdAt.toString())}
          </p>
          <p className="text-sm">{post.caption}</p>
        </div>
        <div className="">
          <PostStats post={post} />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
