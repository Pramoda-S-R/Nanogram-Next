import React from "react";
import { CakeSlice, Coins, FilePenLine } from "lucide-react";
import { formatDate, objectIdsToStrings } from "@/utils";
import FollowButton from "@/components/client/shared/FollowButton";
import { currentUser } from "@clerk/nextjs/server";
import {
  getCurrentUser,
  getPostsByIds,
  getUserByUsername,
} from "@/app/actions/api";
import GridPosts from "@/components/server/shared/GridPosts";
import {
  FollowersDialog,
  FollowingDialog,
} from "@/components/client/shared/Follows";

const Profile = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const cUser = await currentUser();
  const user = await getUserByUsername({ username: username.slice(3) });
  const posts = await getPostsByIds(objectIdsToStrings(user?.posts || []));
  const currentuser = await getCurrentUser({ user_id: cUser?.id || "" });

  if (!user) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <p className="text-light-4">User not found</p>
      </div>
    );
  }
  if (!currentuser) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto md:pt-10 py-2 px-3 overflow-y-auto">
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col mr-auto gap-2">
            <div className="flex gap-6 md:items-start items-center">
              <img
                src={user?.avatarUrl || "/assets/icons/user.svg"}
                alt="user"
                className="rounded-full md:size-24 size-16 md:mt-0 mt-1"
                loading="lazy"
              />
              <div className="flex justify-start flex-col">
                <div>
                  <div className="text-xl font-semibold">
                    {user?.firstName} {user?.lastName}{" "}
                    {user?.role !== "user" && (
                      <p
                        className={`badge badge-soft ${
                          user.role === "admin"
                            ? "badge-warning"
                            : user.role === "dev"
                            ? "badge-success"
                            : "badge-secondary"
                        }`}
                      >
                        {user.role}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-base-content/50">
                    @{user?.username}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div className="flex flex-col items-start">
                    <p>{user?.posts?.length || 0}</p>
                    <p className="text-xs">posts</p>
                  </div>
                  <FollowersDialog user={user} currentUser={currentuser} />
                  <FollowingDialog user={user} currentUser={currentuser} />
                </div>
              </div>
            </div>
            <div className="flex md:flex-row flex-col">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-start gap-2">
                  <CakeSlice strokeWidth={1.5} />
                  <p className="text-sm">
                    {formatDate(
                      user?.createdAt.toString() as string,
                      "MMMM DD, YYYY"
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <Coins strokeWidth={1.5} />
                  <p className="text-sm">{user?.karma} Nanobytes</p>
                </div>
              </div>
              <div className="divider divider-horizontal"></div>
              <p className="w-96">{user?.bio}</p>
            </div>
          </div>
          {currentuser?._id !== user?._id && (
            <div className="flex ml-auto gap-2 py-2">
              <FollowButton follower={currentuser} followed={user} />
              <button
                className={"btn"}
                // onClick={() => navigate(`/messages/${user?.$id}`)}
                disabled={!user}
              >
                Message
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="divider"></div>

      {posts.length === 0 ? (
        <p className="text-light-4">No available posts</p>
      ) : (
        <GridPosts posts={posts} showStats={false} showUser={false} />
      )}
    </div>
  );
};

export default Profile;
