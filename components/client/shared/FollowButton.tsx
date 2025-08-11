"use client";
import { followUser } from "@/app/actions/api";
import { User } from "@/types/mongodb";
import React, { useState } from "react";

const FollowButton = ({
  follower,
  followed,
}: {
  follower: User;
  followed: User;
}) => {
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    follower.following?.some((id) => id.toString() === followed._id.toString())
  );
  async function toggleFollow() {
    try {
      setLoading(true);
      const response = await followUser({
        userId: follower._id.toString(),
        followUserId: followed._id.toString(),
      });

      if (!response) {
        throw new Error("Failed to toggle follow status");
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
      className={`btn ${isFollowing ? "btn-outline" : "btn-primary"}`}
      onClick={toggleFollow}
      disabled={loading}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
