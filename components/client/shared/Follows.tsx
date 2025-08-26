import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { User } from "@/types/mongodb";
import { getUsersByIds } from "@/app/actions/api";
import { objectIdsToStrings } from "@/utils";
import Link from "next/link";
import FollowButton from "./FollowButton";
import Image from "next/image";

export const FollowersDialog = ({
  user,
  currentUser,
}: {
  user: User;
  currentUser: User;
}) => {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-col items-start cursor-pointer">
        <p>{user.followers?.length || 0}</p>
        <p className="text-xs">followers</p>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <div className="divider"></div>
        {user.followers?.length === 0 ? (
          <p className="text-center text-base-content/70">
            {user.firstName} does not have any followers
          </p>
        ) : (
          <></>
        )}
        <Followers user={user} currentUser={currentUser} />
      </DialogContent>
    </Dialog>
  );
};

export const FollowingDialog = ({
  user,
  currentUser,
}: {
  user: User;
  currentUser: User;
}) => {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-col items-start cursor-pointer">
        <p>{user.following?.length || 0}</p>
        <p className="text-xs">following</p>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        <div className="divider"></div>
        {user.following?.length === 0 ? (
          <p className="text-center text-base-content/70">
            {user.firstName} does not follow anyone
          </p>
        ) : (
          <></>
        )}
        <Following user={user} currentUser={currentUser} />
      </DialogContent>
    </Dialog>
  );
};

export const Followers = async ({
  user,
  currentUser,
}: {
  user: User;
  currentUser: User;
}) => {
  const followers = await getUsersByIds(
    objectIdsToStrings(user.followers || [])
  );
  return (
    <div>
      <ul>
        {followers.map((follower) => (
          <li
            key={follower._id.toString()}
            className="flex justify-between items-center pb-2"
          >
            <div className="flex gap-2">
              <Link href={`/community/@${follower.username}`}>
                <Image
                  src={follower.avatarUrl || "/assets/icons/user.svg"}
                  width={32}
                  height={32}
                  alt="user"
                  className="rounded-full"
                  loading="lazy"
                />
              </Link>
              <div className="flex flex-col">
                <p className="text-md font-semibold">{follower.fullName}</p>
                <p className="text-xs font-light">@{follower.username}</p>
              </div>
            </div>
            {currentUser?._id === follower._id ? (
              <></>
            ) : (
              <FollowButton follower={currentUser} followed={follower} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Following = async ({
  user,
  currentUser,
}: {
  user: User;
  currentUser: User;
}) => {
  const followings = await getUsersByIds(
    objectIdsToStrings(user.following || [])
  );
  return (
    <div>
      <ul>
        {followings.map((following) => (
          <li
            key={following._id.toString()}
            className="flex justify-between items-center pb-2"
          >
            <div className="flex gap-2">
              <Link href={`/community/@${following.username}`}>
                <Image
                  src={following.avatarUrl || "/assets/icons/user.svg"}
                  width={32}
                  height={32}
                  alt="user"
                  className="rounded-full size-8"
                  loading="lazy"
                />
              </Link>
              <div className="flex flex-col">
                <p className="text-md font-semibold">{following.fullName}</p>
                <p className="text-xs font-light">@{following.username}</p>
              </div>
            </div>
            {currentUser?._id === following._id ? (
              <></>
            ) : (
              <FollowButton follower={currentUser} followed={following} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
