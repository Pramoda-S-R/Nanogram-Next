import React from "react";
import { getAllBlogPosts } from "@/app/actions/api";

const Blog = async () => {
  const blogs = await getAllBlogPosts();

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1>Blog</h1>
      <div className="flex gap-2">
        {blogs.map((blog, idx) => (
          <div key={idx} className="card bg-base-100 w-96 shadow-sm">
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
                <button className="btn btn-primary">Read</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
