import React from "react";
import ReactMarkdown from "react-markdown";
import "../styles/blog.css";
import remarkGfm from "remark-gfm";
import { getAnonymousUser, getBlogPostById } from "@/app/actions/api";
import matter from "gray-matter";
import ReportMedia from "@/components/client/shared/ReportMedia";

export async function getMD(url: URL) {
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const raw = await res.text();

  const { data: metadata, content: markdown } = matter(raw);

  return { metadata, markdown };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) {
  const { blog_id } = await params;
  const anonymusUser = await getAnonymousUser();
  const blogPost = await getBlogPostById(blog_id);
  if (!blogPost?.fileUrl) {
    throw new Error("Blog post fileUrl is undefined");
  }
  const { metadata, markdown } = await getMD(new URL(blogPost.fileUrl));

  if (!anonymusUser) {
    return (
      <section className="w-full flex justify-center items-center h-screen">
        <span className="loading loading-spinner"></span>
      </section>
    )
  }

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

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1>{metadata.title}</h1>
          <p className="text-sm text-base-content/50">
            {metadata.date} — by {metadata.authors?.join(", ")}
          </p>
        </div>
        <ReportMedia media="Blog" mediaId={blogPost._id} currentUser={anonymusUser} userId={blogPost.authorId} />
      </div>
      <hr />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
