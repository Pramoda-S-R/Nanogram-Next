"use client";
import { likePost, savePost } from "@/app/actions/api";
import { Like, Liked, Saved, Save } from "@/components/server/shared/ui/icons";
import { AggregatePost, User } from "@/types";
import { hasLiked, hasSaved } from "@/utils";
import { MessageCircle, ShareIcon } from "lucide-react";
import React, { useState } from "react";

const PostStats = ({
  post,
  user,
  align,
  showLikes = true,
  showComments = true,
  showShare = true,
  showSave = true,
}: {
  post: AggregatePost;
  user: User;
  align?: "end" | "between" | "start";
  showLikes?: boolean;
  showComments?: boolean;
  showShare?: boolean;
  showSave?: boolean;
}) => {
  const [liked, setLiked] = useState(hasLiked(post, user));
  const [saved, setSaved] = useState(hasSaved(post, user));

  const toggleLike = async () => {
    try {
      setLiked(!liked);
      const res = await likePost({
        postId: post._id.toString(),
        userId: user._id.toString(),
      });
      if (!res) {
        setLiked(!liked);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  const toggleSave = async () => {
    try {
      setSaved(!saved);
      const res = await savePost({
        postId: post._id.toString(),
        userId: user._id.toString(),
      });
      if (!res) {
        setSaved(!saved);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  // If no post is provided and all stats are set to true, return null
  if (!post && showLikes && showComments && showShare && showSave) {
    return null;
  }
  return (
    <div className="w-full py-2">
      <div
        className={`w-[85%] mx-auto flex items-center gap-2 justify-${align}`}
      >
        {showLikes && (
          <div
            className="text-base-content flex h-5 gap-1"
            onClick={() => toggleLike()}
          >
            {liked ? <Liked /> : <Like />}{" "}
            <p className="mt-0.5 text-xs">{post.likes.length}</p>
          </div>
        )}
        {showComments && (
          <div className="text-base-content flex h-5 gap-1">
            <MessageCircle strokeWidth={1.5} size={20} />{" "}
            <p className="mt-0.5 text-xs">{post.comments.length}</p>
          </div>
        )}
        {showShare && <ShareIcon strokeWidth={1.5} size={20} />}
        {showSave && (
          <div
            className="text-base-content w-5 h-5"
            onClick={() => toggleSave()}
          >
            {saved ? <Saved className="text-primary" /> : <Save />}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostStats;
