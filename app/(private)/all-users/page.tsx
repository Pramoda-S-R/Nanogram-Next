import React from "react";
import { toast } from "sonner";
import FollowButton from "@/components/client/shared/FollowButton";
import Link from "next/link";
import { getAllUsers, getCurrentUser } from "@/app/actions/api";
import { currentUser } from "@clerk/nextjs/server";
import SearchUsers from "@/components/client/shared/SearchUsers";

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

  if (newCreators?.length !== 0) {
    <div className="text-center text-base-content/50 py-24 md:py-14">
      No users available.
    </div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 py-8 md:py-14">
      <SearchUsers currentuser={currentuser} />
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-2xl text-left w-full">Other Users</h2>
      </div>
      <div className="flex flex-wrap gap-9 w-full mb-14">
        <ul className="flex flex-wrap gap-4 w-full">
          {newCreators?.map((creator) => (
            <li
              key={creator?._id.toString()}
              className="card bg-base-200 w-56 aspect-square justify-center p-2"
            >
              <Link href={`/profile/${creator.username}`}>
                <figure>
                  <img
                    src={creator.avatarUrl || "/assets/icons/user.svg"}
                    alt="creator"
                    className="rounded-full w-14 h-14"
                    loading="lazy"
                  />
                </figure>
                <div className="flex flex-col items-center">
                  <p className="">
                    {creator.firstName} {creator.lastName}
                  </p>
                  <p className="small-regular text-light-3 text-center line-clamp-1">
                    @{creator.username}
                  </p>
                </div>
              </Link>
              <div className="flex justify-center mt-2">
                <FollowButton follower={currentuser} followed={creator} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllUsers;
