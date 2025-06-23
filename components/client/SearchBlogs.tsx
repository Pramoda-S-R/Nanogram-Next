"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const SearchBlogs = () => {
  const router = useRouter();

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
  return (
    <div className="w-full flex justify-end gap-2 px-10">
      <label className="input">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          ref={inputRef}
          type="search"
          className="grow"
          placeholder="Search"
        />
        <kbd className="kbd kbd-sm">Ctrl</kbd>
        <kbd className="kbd kbd-sm">K</kbd>
      </label>
      <button
        className="btn btn-primary"
        onClick={() => router.push("/blog/write-blog")}
      >
        Blog
      </button>
    </div>
  );
};

export default SearchBlogs;
