import PostForm from "@/components/client/shared/PostForm";
import { ImagePlus } from "lucide-react";
import React from "react";

const CreatePost = () => {
  return (
    <>
      <div className="flex gap-2 items-center my-4">
        <ImagePlus size={36} />
        <h2 className="text-3xl font-bold text-left w-full">Create Post</h2>
      </div>
      <PostForm action="Create" />
    </>
  );
};

export default CreatePost;
