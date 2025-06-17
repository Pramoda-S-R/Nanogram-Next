"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Edit, Ellipsis, Trash2, TriangleAlert } from "lucide-react";
import { AggregatePost, User } from "@/types";
import { deletePostById } from "@/app/actions/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PostActions = ({ post, user }: { post: AggregatePost; user: User }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const deleteThisPost = async () => {
    setLoading(true);
    try {
      const res = await deletePostById(post._id.toString());
      if (!res) {
        throw new Error("Failed to delete post");
      }
      toast("Post deleted successfully", {
        description:
          "Your post has been removed.\nChanges may take a moment to reflect.",
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast("Failed to delete post", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Ellipsis />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          {/* {user._id === post.creator._id && ( */}
          <>
            <button
              className="btn btn-primary justify-start"
              onClick={() => router.push(`/update-post/${post._id}`)}
            >
              <Edit strokeWidth={1.5} />
              Edit Post
            </button>
            <button
              className="btn btn-soft btn-error justify-start"
              onClick={deleteThisPost}
              disabled={loading}
            >
              <Trash2 strokeWidth={1.5} />
              Delete Post
            </button>
          </>
          {/* )} */}
          <button className="btn btn-error justify-start">
            <TriangleAlert strokeWidth={1.5} />
            Report Post
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PostActions;
