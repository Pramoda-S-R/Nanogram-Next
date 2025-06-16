import { getPostsByIds, getUserByUsername } from "@/app/actions/api";
import { objectIdsToStrings } from "@/utils";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername({ username: username.slice(3) });
  const posts = await getPostsByIds(objectIdsToStrings(user?.posts ?? []));
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <p>{user.bio}</p>
      <h2>Posts:</h2>
      <ul>
        {posts?.map((post) => (
          <li key={post._id.toString()}>{post.caption}</li>
        ))}
      </ul>
    </div>
  );
}
