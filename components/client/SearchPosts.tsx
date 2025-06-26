"use client";
import { Search } from "lucide-react";
import React, { useEffect, useRef } from "react";

const SearchPosts = () => {
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
    <label className="input focus:outline-none focus-within:outline-none">
      <Search width={24} strokeWidth={1.5} />
      <input
        type="search"
        className="grow"
        placeholder="Search"
        ref={inputRef}
      />
      <kbd className="kbd kbd-sm">Ctrl</kbd>
      <kbd className="kbd kbd-sm">K</kbd>
    </label>
  );
};

export default SearchPosts;
