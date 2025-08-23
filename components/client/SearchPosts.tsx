"use client";
import { getPostsByTags, getPostsFromQdrant } from "@/app/actions/api";
import useDebounce from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const Post = ({ post }: { post: any }) => {
  return (
    <Link
      href={`/posts/${post._id}`}
      className="md:w-64 md:h-64 w-2/3 bg-base-200 rounded-lg overflow-clip shadow-xl"
    >
      <div className="relative">
        <p className="absolute w-full h-full p-4 bg-linear-to-b from-black to-black/10">
          {post.caption}
        </p>
        {post.imageUrl && <img src={post.imageUrl} alt="Post Image" />}
      </div>
    </Link>
  );
};

const SearchPosts = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const [loading, setLoading] = useState(false);
  const [tagSearch, setTagSearch] = useState(false);
  const [shouldShowSearchResults, setShouldShowSearchResults] = useState(false);
  const [searchedPosts, setSearchedPosts] = useState<any[]>([]);
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
    const getSearchedPosts = async () => {
      if (debouncedValue.length === 0) {
        setSearchedPosts([]);
        setShouldShowSearchResults(false);
        return;
      }

      setLoading(true);
      if (debouncedValue.startsWith("#")) {
        // If the search starts with a hashtag, we can treat it as a tag search
        setTagSearch(true);
        try {
          const posts = await getPostsByTags({
            tags: [debouncedValue.slice(1)], // Remove the '#' from the tag
            limit: 3,
          });
          setSearchedPosts(posts);
          setShouldShowSearchResults(true);
        } catch (error) {
          console.error("Error fetching searched posts by tag:", error);
        } finally {
          setLoading(false);
          return;
        }
      }
      try {
        setTagSearch(false);
        const posts = await getPostsFromQdrant(debouncedValue, 3);
        setSearchedPosts(posts);
        setShouldShowSearchResults(true);
      } catch (error) {
        console.error("Error fetching searched users:", error);
      } finally {
        setLoading(false);
      }
    };

    getSearchedPosts();
  }, [debouncedValue]);

  return (
    <div>
      <label className="input focus:outline-none focus-within:outline-none mb-4 md:m-0 ml-2">
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
      {shouldShowSearchResults && debouncedValue.length > 0 ? (
        <>
          <h3 className="mt-4 text-xl">Search Results</h3>
          {loading && (
            <div className="w-full flex justify-center m-4">
              <span className="loading loading-spinner loading-xl"></span>
            </div>
          )}
          <div className="w-full flex flex-wrap md:justify-start justify-center gap-2 py-4">
            {searchedPosts.length > 0 ? (
              tagSearch ? (
                searchedPosts.map((post, idx) => (
                  <Post key={idx} post={post} />
                ))
              ) : (
                searchedPosts.map((post, idx) => (
                  <Post key={idx} post={post.payload} />
                ))
              )
            ) : (
              <p className="text-base-content/50">No results found.</p>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SearchPosts;
