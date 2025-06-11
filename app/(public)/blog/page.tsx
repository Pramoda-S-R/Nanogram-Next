import { getAllBlogPosts } from "@/api";
import React from "react";

const Blog = async () => {
  const blogs = await getAllBlogPosts();
  return (
    <div>
      Blog
      <ul>
        {blogs.map((blog) => (
          <li key={blog._id.toString()}>
            <a href={`/blog/${blog.route}`}>{blog.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
