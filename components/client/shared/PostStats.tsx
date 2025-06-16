"use client";
import { Like, Liked, Saved, Save } from "@/components/server/shared/ui/icons";
import { AggregatePost } from "@/types";
import { MessageCircle, ShareIcon } from "lucide-react";
import React, { useState } from "react";

const PostStats = ({
  post,
  showLikes = true,
  showComments = true,
  showShare = true,
  showSave = true,
}: {
  post: AggregatePost;
  showLikes?: boolean;
  showComments?: boolean;
  showShare?: boolean;
  showSave?: boolean;
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  // If no post is provided and all stats are set to true, return null
  if (!post && showLikes && showComments && showShare && showSave) {
    return null;
  }
  return (
    <div className="w-full py-2">
      <div className="w-[85%] mx-auto flex items-center justify-between">
        {showLikes && (
          <div
            className="text-base-content w-5 h-5"
            onClick={() => setLiked(!liked)}
          >
            {liked ? <Liked /> : <Like />}
          </div>
        )}
        {showComments && <MessageCircle strokeWidth={1.5} />}
        {showShare && <ShareIcon strokeWidth={1.5} />}
        {showSave && (
          <div
            className="text-base-content w-5 h-5"
            onClick={() => setSaved(!saved)}
          >
            {saved ? <Saved className="text-primary" /> : <Save />}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostStats;
