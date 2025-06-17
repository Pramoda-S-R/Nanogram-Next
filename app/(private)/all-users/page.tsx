import React from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import FollowButton from "@/components/client/shared/FollowButton";
import Link from "next/link";
import { getAllUsers, getCurrentUser } from "@/app/actions/api";
import { currentUser } from "@clerk/nextjs/server";

const AllUsers = async () => {
  const clerkCurrentUser = await currentUser();
  const currentuser = await getCurrentUser({
    user_id: clerkCurrentUser?.id || "",
  });
  const creators = await getAllUsers();

  const newCreators = creators?.filter(
    (creator) => creator._id !== currentuser?._id
  );

  if (!creators || !currentuser) {
    toast("Something went wrong", {
      description: "We couldn't fetch the creators. Please try again later.",
    });

    return;
  }

  const searchedUsers = newCreators;
  const shouldShowSearchResults = false;
  const shouldShowUsers = !shouldShowSearchResults && newCreators?.length !== 0;

  return (
    <div className="u">
      <div className="">
        <h2 className="h3-bold md:h2-bold w-full">Search Users</h2>
        <label htmlFor="search users" className="input ">
          <Search size={24} />
          <input placeholder="Search users by name or username" className="" />
        </label>
      </div>
      {shouldShowSearchResults ? (
        <div className="flex flex-wrap gap-9 w-full max-w-5xl mb-14">
          <ul className="flex flex-col gap-2 w-full">
            {searchedUsers?.map((creator) => (
              <li key={creator?._id.toString()} className="flex-1 w-full">
                <div className="flex-between w-full max-w-5xl">
                  <Link
                    href={`/profile/@${creator.username}`}
                    className="flex-start gap-4"
                  >
                    <img
                      src={creator.avatarUrl || "/assets/icons/user.svg"}
                      alt={creator.username || "creator"}
                      className="size-16 rounded-full"
                      loading="lazy"
                    />
                    <div className="flex justify-start flex-col gap-1">
                      <p className="text-left line-clamp-1">
                        {creator.firstName} {creator.lastName}
                      </p>
                      <p className="text-left line-clamp-1">
                        @{creator.username}
                      </p>
                    </div>
                  </Link>
                  <div
                    className={`${
                      creator._id === currentuser._id ? "hidden" : ""
                    } flex justify-end items-center`}
                  >
                    <FollowButton follower={currentuser} followed={creator} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : shouldShowUsers ? (
        <>
          <div className="flex items-center justify-between w-full max-w-5xl">
            <h2 className="h3-bold md:h2-bold text-left w-full">Other Users</h2>
          </div>
          <div className="flex flex-wrap gap-9 w-full max-w-5xl mb-14">
            <ul className="user-grid">
              {newCreators?.map((creator) => (
                <li
                  key={creator?._id.toString()}
                  className="flex-1 min-w-0 w-full  "
                >
                  <div className="user-card">
                    <Link
                      href={`/profile/${creator.username}`}
                      className="flex-center flex-col gap-4"
                    >
                      <img
                        src={creator.avatarUrl || "/assets/icons/user.svg"}
                        alt="creator"
                        className="rounded-full w-14 h-14"
                        loading="lazy"
                      />

                      <div className="flex-center flex-col gap-1">
                        <p className="base-medium text-light-1 text-center line-clamp-1">
                          {creator.firstName} {creator.lastName}
                        </p>
                        <p className="small-regular text-light-3 text-center line-clamp-1">
                          @{creator.username}
                        </p>
                      </div>
                    </Link>
                    <FollowButton follower={currentuser} followed={creator} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : newCreators?.length !== 0 ? (
        <div className="loading loading-spinner"></div>
      ) : (
        <div className="text-center text-neutral-black/50 py-24 md:py-14">
          No users available.
        </div>
      )}
    </div>
  );
};

export default AllUsers;
