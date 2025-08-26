"use client";
import { User } from "@/types/mongodb";
import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { useRouter } from "next/navigation";
import { Binary, CakeSlice } from "lucide-react";
import { formatDate } from "@/utils";
import Image from "next/image";

const PostCreator = ({
  creator,
  onlyImage = false,
}: {
  creator: User;
  onlyImage?: boolean;
}) => {
  const router = useRouter();
  return (
    <HoverCard>
      <HoverCardTrigger
        href={creator ? `/community/@${creator.username}` : "#"}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <Image
                width={40}
                height={40}
                src={creator.avatarUrl || "/assets/images/placeholder.png"}
                alt="User Avatar"
                priority
              />
            </div>
          </div>
          {!onlyImage && (
            <div className="text-start">
              <h2 className="card-title">{creator.fullName}</h2>
              <p className="text-xs">@{creator.username}</p>
            </div>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="card max-w-120 bg-base-100 shadow-sm px-0 py-0 border-0">
        <div className="card-body w-full text-wrap">
          <div className="flex items-center gap-2 mb-2">
            <Image
              width={40}
              height={40}
              src={creator.avatarUrl || "/assets/images/placeholder.png"}
              alt={creator.username}
              className="rounded-full"
              priority
            />
            <div>
              <h2 className="card-title">
                {creator.fullName ? creator.fullName : "[deleted user]"}
              </h2>
              <p className="text-xs">
                {creator.username ? `@${creator.username}` : "[deleted user]"}
              </p>
            </div>
          </div>
          {creator.bio && <p>{creator.bio}</p>}
          {creator ? (
            <>
              <p className="text-xs flex items-center gap-1">
                <Binary strokeWidth={1.5} />
                {creator.karma} Nanobytes{" "}
              </p>
              <p className="text-xs flex items-center gap-1">
                <CakeSlice strokeWidth={1.5} />
                {formatDate(creator.createdAt.toString(), "MMMM DD, YYYY")}
              </p>
            </>
          ) : (
            <p className="text-xs text-base-content/30">No additional info</p>
          )}
          <div className="card-actions justify-end">
            {creator && (
              <>
                <button
                  className="btn btn-soft btn-info"
                  onClick={() => router.push(`/community/@${creator.username}`)}
                >
                  View
                </button>
                <button className="btn btn-soft btn-secondary">Message</button>
              </>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default PostCreator;
