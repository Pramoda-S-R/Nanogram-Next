"use client";
import { getBlogPostsByQdrant } from "@/app/actions/api";
import useDebounce from "@/hooks/useDebounce";
import { BlogPost } from "@/types/mongodb";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const SearchBlogs = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const [loading, setLoading] = useState(false);
  const [shouldShowSearchResults, setShouldShowSearchResults] = useState(false);
  const [searchedBlogs, setSearchedBlogs] = useState<BlogPost[]>([]);
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

  useEffect(() => {
    const fetchBlogs = async () => {
      if (debouncedValue.length === 0) {
        setSearchedBlogs([]);
        setShouldShowSearchResults(false);
        return;
      }

      setLoading(true);
      try {
        const blogs = await getBlogPostsByQdrant({
          query: debouncedValue,
          limit: 3,
        });
        setSearchedBlogs(blogs);
        setShouldShowSearchResults(true);
      } catch (error) {
        console.error("Error fetching searched blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [debouncedValue]);

  return (
    <div className="w-full">
      <div className="w-full flex justify-end gap-2 px-10">
        <label className="input focus:outline-none focus-within:outline-none">
          <Search width={24} strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="search"
            className="grow"
            placeholder="Search"
            onChange={(e) => setSearchValue(e.target.value)}
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
      {shouldShowSearchResults && debouncedValue.length > 0 ? (
        <>
          <h3 className="mx-4 text-xl">Search Results</h3>
          {loading && (
            <div className="w-full flex justify-center mx-4">
              <span className="loading loading-spinner loading-xl"></span>
            </div>
          )}
          <div className="w-full flex gap-2 p-4">
            {searchedBlogs.length > 0 ? (
              searchedBlogs.map((blog, idx) => (
                <div key={idx} className="card bg-base-200 w-96 shadow-sm">
                  <figure>
                    <Image
                      src={
                        blog.cover ||
                        "/assets/images/nanogram_logo-twitter-card.png"
                      }
                      alt="cover"
                      width={384}
                      height={128}
                      className="w-full h-32 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{blog.title}</h2>
                    <div
                      className="tooltip tooltip-top"
                      data-tip={blog.desc}
                    >
                      <p>
                        {blog.desc
                          ? blog.desc.slice(0, 120)
                          : "No description available."}
                        {blog.desc && blog.desc.length > 120
                          ? "..."
                          : ""}
                      </p>
                    </div>
                    <div className="card-actions justify-end">
                      <Link
                        href={`/blog/${blog.route}`}
                        className="btn btn-primary"
                      >
                        Read
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center">No Blogs found</div>
            )}
          </div>
          <div className="divider"></div>
        </>
      ) : null}
    </div>
  );
};

export default SearchBlogs;
