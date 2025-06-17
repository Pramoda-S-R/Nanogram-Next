"use client";
import { User } from "@/types";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FollowButton from "./FollowButton";
import useDebounce from "@/hooks/useDebounce";
import { searchUsers } from "@/app/actions/api";

const SearchUsers = ({ currentuser }: { currentuser: User }) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 50);
  const [shouldShowSearchResults, setShouldShowSearchResults] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);

  useEffect(() => {
    const getSearchedUsers = async () => {
      if (debouncedValue.length === 0) {
        setSearchedUsers([]);
        setShouldShowSearchResults(false);
        return;
      }

      try {
        const users = await searchUsers(debouncedValue);
        setSearchedUsers(users);
        setShouldShowSearchResults(true);
      } catch (error) {
        console.error("Error fetching searched users:", error);
      }
    };

    getSearchedUsers();
  }, [debouncedValue]);

  return (
    <>
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-2xl w-full">Search Users</h2>
        <label htmlFor="search users" className="input ">
          <Search size={24} />
          <input
            placeholder="Search users by name or username"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </label>
      </div>
      {shouldShowSearchResults && (
        <ul className="bg-base-200 flex flex-col py-8 px-4 mb-8 w-full">
          {searchedUsers?.map((creator, idx) => (
            <>
              <li key={idx} className="flex justify-between w-full">
                <Link
                  href={`/profile/@${creator.username}`}
                  className="flex item-center gap-4"
                >
                  <figure className="flex items-center justify-center">
                    <img
                      src={creator.avatarUrl || "/assets/icons/user.svg"}
                      alt={creator.username || "creator"}
                      className="size-10 rounded-full"
                      loading="lazy"
                    />
                  </figure>
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
              </li>
              {idx !== searchedUsers.length - 1 && (
                <div className="divider"></div>
              )}
            </>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchUsers;
