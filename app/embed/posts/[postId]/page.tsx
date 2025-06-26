import { getPostById } from "@/app/actions/api";
import { Liked, Save } from "@/components/server/shared/ui/icons";
import { timeAgo } from "@/utils";
import { MessageCircle, ShareIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const EmbedPosts = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const { postId } = await params;
  const post = await getPostById(postId);
  if (!post) {
    return <div className="w-full text-center mt-10">Post not found</div>;
  }
  return (
    <div className="card bg-base-200 md:w-96 w-full shadow-sm">
      <div className="card-body">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    post.creator.avatarUrl || "/assets/images/placeholder.png"
                  }
                  alt="User Avatar"
                />
              </div>
            </div>
            <div className="text-start">
              <h2 className="card-title">
                {post.creator.firstName} {post.creator.lastName}
              </h2>
              <p className="text-xs">@{post.creator.username}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-base-content/30">
          Posted on {post.source}, {timeAgo(post.createdAt.toString())}
        </p>
        <p className="">{post.caption || "No caption provided."}</p>
        <ul className="flex flex-wrap gap-1 mt-1">
          {post.tags.length === 0
            ? null
            : post.tags.map((tag) => (
                <li key={tag} className="text-primary font-light">
                  #{tag}
                </li>
              ))}
        </ul>
      </div>
      {post.imageUrl && (
        <Link href={`/posts/${post._id.toString()}`}>
          <figure>
            <img
              src={post.imageUrl || "/assets/images/placeholder.png"}
              alt={post._id.toString()}
            />
          </figure>
        </Link>
      )}
      <div className="w-full py-2">
        <div className="w-[85%] mx-auto flex items-center justify-between">
          <Liked className="w-5" />
          <MessageCircle strokeWidth={1.5} />
          <ShareIcon strokeWidth={1.5} />
          <Save />
        </div>
      </div>
    </div>
  );
};

export default EmbedPosts;
