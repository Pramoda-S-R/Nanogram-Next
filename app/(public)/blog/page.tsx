import React from "react";
import { getAllBlogPosts } from "@/app/actions/api";
import { Plus } from "lucide-react";
import Link from "next/link";

const Blog = async () => {
  const blogs = await getAllBlogPosts();

  return (
    <div className="w-full h-screen flex flex-col gap-4 relative">
      <div className="w-full h-30 bg-base-200 half-ellipse flex items-center justify-center overflow-hidden">
        <h1 className="text-5xl font-bold">Nanogram Blogs</h1>
      </div>
      <div className="w-full flex flex-wrap gap-2 p-4">
        {blogs.map((blog, idx) => (
          <div key={idx} className="card bg-base-200 w-96 shadow-sm">
            <figure>
              <img
                src={
                  blog.cover || "/assets/images/nanogram_logo-twitter-card.png"
                }
                alt="cover"
                className="w-full h-32 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{blog.title}</h2>
              <div className="tooltip tooltip-top" data-tip={blog.desc}>
                <p>
                  {blog.desc
                    ? blog.desc.slice(0, 120)
                    : "No description available."}
                  {blog.desc && blog.desc.length > 120 ? "..." : ""}
                </p>
              </div>
              <div className="card-actions justify-end">
                <Link href={`/blog/${blog.route}`} className="btn btn-primary">Read</Link>
              </div>
            </div>
          </div>
        ))}
        <div className="card w-96 bg-base-200 shadow-sm">
          <Link href={"/blog/write-blog"} className="card-body justify-center items-center text-7xl"><Plus size={80} /></Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;
