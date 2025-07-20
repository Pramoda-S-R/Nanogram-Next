"use client";
import { User } from "@/types";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import FollowButton from "./FollowButton";
import useDebounce from "@/hooks/useDebounce";
import { searchUsers } from "@/app/actions/api";

const SearchUsers = ({
  currentuser,
  showTitle = true,
  variant = "default",
  onClickCallback,
}: {
  currentuser: User;
  showTitle?: boolean;
  variant?: "default" | "small";
  onClickCallback?: (user: User) => void;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 50);
  const [shouldShowSearchResults, setShouldShowSearchResults] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    interface KeyboardEventWithKey extends KeyboardEvent {
      key: string;
    }

    const handleKeyDown = (e: KeyboardEventWithKey): void => {
      const isMac: boolean = navigator.platform.toUpperCase().includes("MAC");
      const isShortcut: boolean =
        (isMac && e.metaKey && e.key === "k") ||
        (!isMac && e.ctrlKey && e.key === "k");

      if (isShortcut) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        {showTitle && <h2 className="text-2xl w-full">Search Users</h2>}
        <label
          htmlFor="search users"
          className="w-96 input focus:outline-none focus-within:outline-none"
        >
          <Search size={24} strokeWidth={1.5} />
          <input
            type="search"
            placeholder="Search users by name or username"
            ref={inputRef}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <kbd className="kbd kbd-sm">Ctrl</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
      </div>
      {shouldShowSearchResults && (
        <ul className={variant === "default" ? "bg-base-200 flex flex-col py-8 px-4 mb-8 w-full" : "flex flex-wrap gap-2"}>
          {searchedUsers?.map((creator, idx) => (
            <div key={idx}>
              {variant === "default" ? (
                <li className="flex justify-between w-full">
                  <Link
                    href={`/community/@${creator.username}`}
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
              ) : (
                <button
                  className="rounded-full overflow-clip"
                  onClick={() => onClickCallback && onClickCallback(creator)}
                >
                  <img
                    src={creator.avatarUrl}
                    alt={creator.username}
                    className="size-10"
                  />
                </button>
              )}
              {idx !== searchedUsers.length - 1 && variant === "default" && (
                <div className="divider"></div>
              )}
            </div>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchUsers;
