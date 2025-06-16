import { getFypPosts } from "@/app/actions/api";
import PostCard from "@/components/server/shared/PostCard";
import React from "react";

const Community = async () => {
  const posts = await getFypPosts();
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      {posts.map((post) => (
        <PostCard key={post._id.toString()} post={post} />
      ))}
    </div>
  );
};

export default Community;
