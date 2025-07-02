import {
  getCurrentUser,
  getPostById,
  getPostsByIds,
  getSimilarPosts,
} from "@/app/actions/api";
import GridPosts from "@/components/server/shared/GridPosts";
import PostDetails from "@/components/server/shared/PostDetails";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

export default async function Post({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await getPostById(postId);
  const similarPostsV = await getSimilarPosts(postId, 3);
  const similarPostsIds: string[] = similarPostsV.map(
    (post) => post.payload._id
  );
  const similarPosts = await getPostsByIds(similarPostsIds);
  similarPosts.sort((a, b) => {
    const indexA = similarPostsIds.indexOf(a._id.toString());
    const indexB = similarPostsIds.indexOf(b._id.toString());
    return indexA - indexB;
  });
  const user = await currentUser();
  const currentUserObj = await getCurrentUser({ user_id: user?.id || "" });
  if (!post) {
    return <div className="w-full text-center mt-10">Post not found</div>;
  }
  if (!currentUserObj) {
    return <div className="w-full text-center mt-10">User not found</div>;
  }
  return (
    <>
      <div className="mx-auto max-w-4xl my-10 flex flex-col gap-4">
        <PostDetails post={post} user={currentUserObj} />
        <h2 className="text-2xl font-semibold">Similar Posts</h2>
        <GridPosts posts={similarPosts} />
      </div>
    </>
  );
}
