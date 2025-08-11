"use client";

import dynamic from "next/dynamic";
import { User } from "@/types/mongodb";

// Dynamic import client-side only
const FollowButton = dynamic(() => import("./FollowButton"));

export default function FollowButtonWrapper({
  follower,
  followed,
}: {
  follower: User;
  followed: User;
}) {
  return <FollowButton follower={follower} followed={followed} />;
}
