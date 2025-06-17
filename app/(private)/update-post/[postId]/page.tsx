import { getPostById } from "@/app/actions/api";
import PostForm from "@/components/client/shared/PostForm";
import { ImagePlus } from "lucide-react";
import React from "react";

export default async function UpdatePost({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await getPostById(postId);
  if (!post) {
    return <div className="w-full text-center mt-10">Post not found</div>;
  }
  return (
    <>
      <div className="flex gap-2 items-center my-4">
        <ImagePlus size={36} />
        <h2 className="text-3xl font-bold text-left w-full">Update Post</h2>
      </div>
      <PostForm post={post} action="Update" />
    </>
  );
}
