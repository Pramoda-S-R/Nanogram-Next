"use client";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import SearchPosts from "./SearchPosts";
import { Compass, Filter } from "lucide-react";
import { AggregatePost } from "@/types";
import GridPosts from "../server/shared/GridPosts";
import { getPostsInfiniteScroll } from "@/app/actions/api";

const options = ["Newest", "Oldest", "Most Liked"];

const ExplorePosts = () => {
  const { ref, inView } = useInView();
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState(2);
  const [posts, setPosts] = useState<AggregatePost[]>([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    const fecthPosts = async () => {
      setLoading(true);
      const sortBy =
        option === 0
          ? "createdAt&order=-1"
          : option === 1
          ? "createdAt&order=1"
          : "likesCount&order=-1";
      const limit = 10;
      const res = await getPostsInfiniteScroll({
        sortBy,
        limit,
        skip: page * limit,
      });
      if (res) {
        setPosts((prev) => {
          const newPostIds = new Set(prev.map((p) => p._id));
          const filtered = res.filter((p) => !newPostIds.has(p._id));
          return [...prev, ...filtered];
        });
      }
      if (res.length < limit) {
        setHasNextPage(false);
      } else {
        setHasNextPage(true);
      }
      setLoading(false);
    };
    fecthPosts();
  }, [option, page]);

  useEffect(() => {
    if (inView && hasNextPage && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasNextPage, loading]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasNextPage(true);
  }, [option]);

  return (
    <div>
      <SearchPosts />
      <div className="flex flex-col w-full mb-10">
        <div className="flex justify-between w-full mb-5">
          <div className="flex items-center gap-2">
            <Compass />
            <h2 className="font-bold text-2xl mb-1">Explore</h2>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-accent m-1">
              <Filter />
              {options[option]}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box w-36 z-1 p-2 shadow-sm"
            >
              <li>
                <button
                  className="btn btn-accent"
                  disabled={option === 0}
                  onClick={() => setOption(0)}
                >
                  Newest
                </button>
              </li>
              <li>
                <button
                  className="btn btn-accent"
                  disabled={option === 1}
                  onClick={() => setOption(1)}
                >
                  Oldest
                </button>
              </li>
              <li>
                <button
                  className="btn btn-accent"
                  disabled={option === 2}
                  onClick={() => setOption(2)}
                >
                  Most Liked
                </button>
              </li>
            </ul>
          </div>
        </div>
        <GridPosts posts={posts} />
      </div>
      {hasNextPage && (
        <div className="w-full flex justify-center mt-4" ref={ref}>
          <span className="loading loading-infinity loading-xl"></span>
        </div>
      )}
    </div>
  );
};

export default ExplorePosts;
