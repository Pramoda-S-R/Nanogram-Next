import { getCurrentUser, getFypPosts } from "@/app/actions/api";
import PostCard from "@/components/server/shared/PostCard";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const Community = async () => {
  const posts = await getFypPosts();
  const user = await currentUser();
  const currentUserObj = await getCurrentUser({ user_id: user?.id || "" });

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-lg text-base-content/50">No posts available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      {currentUserObj &&
        posts.map((post) => (
          <PostCard
            key={post._id.toString()}
            post={post}
            user={currentUserObj}
          />
        ))}
    </div>
  );
};

export default Community;
