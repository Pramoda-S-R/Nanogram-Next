import React from "react";
import { getMD } from "@/lib/blog";
import ReactMarkdown from "react-markdown";
import "../styles/blog.css";
import remarkGfm from "remark-gfm";
import { getBlogPostById } from "@/app/actions/api";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) {
  const { blog_id } = await params;
  const blogPost = await getBlogPostById(blog_id);
  if (!blogPost?.fileUrl) {
    throw new Error("Blog post fileUrl is undefined");
  }
  const { metadata, markdown } = await getMD(new URL(blogPost.fileUrl));

  return (
    <div className="blog w-full px-4 md:px-2 md:pr-6 pb-20">
      {metadata.cover && (
        <div className="aspect-[3/1] overflow-hidden">
          <img
            src={metadata.cover}
            alt="cover image"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1>{metadata.title}</h1>
      <p className="text-sm text-base-content/50">
        {metadata.date} — by {metadata.authors?.join(", ")}
      </p>
      <hr />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
