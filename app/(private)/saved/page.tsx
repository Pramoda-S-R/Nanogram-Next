import { getCurrentUser, getPostsByIds } from "@/app/actions/api";
import GridPosts from "@/components/server/shared/GridPosts";
import { objectIdsToStrings } from "@/utils";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const Saved = async () => {
  const user = await currentUser();
  const currentUserObj = await getCurrentUser({ user_id: user?.id || "" });
  const savedPostsIds = objectIdsToStrings(currentUserObj?.savedPosts ?? []);
  const savedPosts = await getPostsByIds(savedPostsIds);
  if (!currentUserObj) {
    return <div className="w-full text-center mt-10">User not found</div>;
  }
  if (savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-lg text-base-content/50">
          No saved posts available.
        </p>
      </div>
    );
  }
  return (
    <div className="md:max-w-5xl mx-auto max-w-full md:px-0 px-2 pt-10 mb-18">
      <GridPosts posts={savedPosts} />
    </div>
  );
};

export default Saved;
