"use client";
import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./shared/ui/Popover";
import {
  ChevronsLeft,
  ChevronsRight,
  MessageCirclePlus,
  Search,
} from "lucide-react";
import clsx from "clsx";
import { useUser } from "@clerk/nextjs";
import { avatars } from "@/constants";
import useDebounce from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePathname } from "next/navigation";
import path from "path";
import { getNewUsers } from "@/app/actions/api";
import { User } from "@/types/mongodb";
import Link from "next/link";

const CONTACTS = [
  {
    _id: "1",
    fullName: "John Doe",
    username: "johndoe",
    avatarUrl: avatars[Math.floor(Math.random() * avatars.length)],
  },
  {
    _id: "2",
    fullName: "Jane Smith",
    username: "janesmith",
    avatarUrl: avatars[Math.floor(Math.random() * avatars.length)],
  },
  {
    _id: "3",
    fullName: "Alice Johnson",
    username: "alicejohnson",
    avatarUrl: avatars[Math.floor(Math.random() * avatars.length)],
  },
];

function SearchContacts({
  className,
  callback,
}: {
  className?: string;
  callback?: (searchedContacts: string) => void;
}) {
  const contactList = [...CONTACTS];
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);

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
    callback?.(debouncedValue);
  }, [debouncedValue]);

  return (
    <label
      className={clsx(
        "input my-2 focus:outline-none focus-within:outline-none",
        className
      )}
    >
      <Search width={24} strokeWidth={1.5} />
      <input
        type="search"
        className="grow"
        placeholder="Search"
        ref={inputRef}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <kbd className="kbd kbd-sm">Ctrl</kbd>
      <kbd className="kbd kbd-sm">K</kbd>
    </label>
  );
}

const Contacts = () => {
  const { isLoaded, user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [allContacts] = useState([...CONTACTS]);
  const [contacts, setContacts] = useState<User[]>([]);

  const pathname = usePathname();
  const isMobile = useIsMobile();

  const handleCallback = (searchValue: string) => {
    // if (!searchValue.trim()) {
    //   setContacts(allContacts); // Reset to full list on empty input
    //   return;
    // }
    // const filtered = allContacts.filter((contact) =>
    //   contact.fullName.toLowerCase().includes(searchValue.toLowerCase())
    // );
    // setContacts(filtered);
  };

  useEffect(() => {
    setMounted(true);
    async function fetchContacts() {
      const people = await getNewUsers();
      if (people) {
        setContacts(people);
      }
    }
    fetchContacts();
  }, []);

  const ExpandedView = () => {
    if (!isLoaded || !user) {
      return (
        <div className="flex flex-col w-full h-dvh p-2">
          <div className="w-full flex justify-between">
            <h2 className="skeleton w-32"></h2>
            <MessageCirclePlus strokeWidth={1.5} width={20} />
          </div>
          <div className="divider my-0"></div>
          <div className="h-9 w-full skeleton my-2"></div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {Array.from({ length: 7 }).map((_, index) => (
              <div className="w-full flex gap-2" key={index}>
                <div className="w-10 h-10 rounded-full skeleton"></div>
                <div className="w-32 h-10 skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col h-dvh p-2 ">
        <div className="w-full flex justify-between">
          <h2 className="font-semibold">@{user.username}</h2>
          <button>
            <MessageCirclePlus strokeWidth={1.5} width={20} />
          </button>
        </div>
        <div className="divider my-0"></div>
        <SearchContacts callback={handleCallback} className="w-full" />
        <div className="flex flex-col gap-2 mt-0.5 overflow-y-auto">
          {contacts.map((contact, idx) => (
            <Link
              href={`/messages/${contact.username}`}
              className="flex gap-2"
              key={idx}
            >
              <div className="avatar">
                <div className="w-10 h-10 rounded-full">
                  <img src={contact.avatarUrl} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold">{contact.fullName}</h3>
                <p className="text-xs text-base-content/50">
                  @{contact.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const CollapsedView = () => {
    return (
      <div className="flex w-10 flex-col items-center h-dvh p-2">
        <MessageCirclePlus strokeWidth={1.5} width={20} />
        <div className="divider my-0"></div>
        <Popover>
          <PopoverTrigger>
            <Search strokeWidth={1.5} width={20} />
          </PopoverTrigger>
          <PopoverContent className="">
            <div className="w-full flex justify-center">
              <SearchContacts className="w-full" />
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex flex-col gap-2 mt-1 overflow-y-auto">
          {contacts.map((contact, idx) => (
            <div className="flex gap-2" key={idx}>
              <div className="avatar" title={contact.fullName}>
                <div className="w-10 h-10 rounded-full">
                  <img src={contact.avatarUrl} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (pathname !== "/messages" && isMobile) {
    return null;
  }
  if (!mounted || isMobile) {
    return (
      <div className="flex flex-col w-full h-dvh p-2">
        <ExpandedView />
      </div>
    );
  }

  return (
    <div className="flex bg-base-200 border-r-2 border-base-content/10 relative group px-1">
      {collapsed ? (
        <CollapsedView />
      ) : (
        <div className="w-64">
          <ExpandedView />
        </div>
      )}
      <button
        type="button"
        className="btn btn-circle hidden group-hover:flex absolute -right-5 top-1/2 mt-2 z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
      </button>
    </div>
  );
};

export default Contacts;
