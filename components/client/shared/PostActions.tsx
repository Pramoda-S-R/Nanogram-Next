"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import {
  CodeXml,
  Edit,
  Ellipsis,
  Eye,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { AggregatePost, User } from "@/types";
import { deletePostById } from "@/app/actions/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const PostActions = ({
  post,
  user,
  showViewButton = true,
}: {
  post: AggregatePost;
  user: User;
  showViewButton?: boolean;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // reset after 3s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
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
          {showViewButton && (
            <button
              className="btn btn-soft btn-secondary justify-start"
              onClick={() => router.push(`/posts/${post._id}`)}
            >
              <Eye strokeWidth={1.5} />
              View Post
            </button>
          )}
          <button
            className="btn btn-soft btn-info justify-start"
            onClick={() =>
              handleCopy(
                `<iframe src="${BASE_URL}/embed/posts/${post._id.toString()}" title="${
                  post.caption
                }"></iframe>`
              )
            }
          >
            <CodeXml />
            {copied ? "Copied!" : "Copy Embed"}
          </button>
          {user._id === post.creator._id && (
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
          )}
          {user._id !== post.creator._id && (
            <button className="btn btn-error justify-start">
              <TriangleAlert strokeWidth={1.5} />
              Report Post
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PostActions;
