"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/blog.css";
import matter from "gray-matter";
import { createBlogPost, getCurrentUser } from "@/app/actions/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { User } from "@/types";

const example = `---
title: "How to Blog"
desc: "A comprehensive guide on how to write and publish a blog post effectively."
date: "2025-05-20"
authors: ["Web Dev", "Viceroy"]
tags: ["Tutorial", "Blog Writing", "How to"]
---

# This is h1
## This is h2
### This is h3

This is a normal sentence
*italic*, _also italic_, **bold**, ~strikethrough~, ~~strikethrough again~~

> BlockQuote  — Someone

1. ordered list
2. is llike this

* unordered list
* is like this
- also this
  - use spaces in multiples of 2 to indent
    - like this

\`here's a code\`

\`\`\`code
print("and this is a code block")
\`\`\`

horizontal rule

---

like this (notice the spacing)

[this is a link](https://nanogram-techhub.vercel.app)

![this is a image](https://nanogram-techhub.vercel.app/assets/images/nanogram_logo-twitter-card.png)

| You can| Make a Table|
| - | - |
| Something | like|
| this | ! |

Here's a sentence with a footnote. [^1]

Checkboxes ?
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

---

*Written with ❤️ by Pramoda S R*

[^1]: This is the footnote.

`;

export default function BlogPage() {
  const { isLoaded, user } = useUser();
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [md, setMd] = useState(example);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<{ [key: string]: any }>({});
  const [reactContent, setReactContent] = useState("");
  const [parseError, setParseError] = useState<string | null>(null); // State to store parsing errors

  useEffect(() => {
    async function fetchCUser() {
      if (isLoaded && user) {
        const cUser = await getCurrentUser({ user_id: user.id });
        if (cUser) {
          setCurrentUser(cUser);
        } else {
          toast.error("Failed to fetch current user data.");
        }
      }
    }
  }, [isLoaded, user]);

  useEffect(() => {
    setParseError(null); // Clear previous errors on new input
    let parsedMetadata = {};
    let parsedMarkdown = "";

    try {
      // Attempt to parse the markdown with gray-matter
      const { data, content } = matter(md);
      parsedMetadata = data;
      parsedMarkdown = content;
    } catch (e: any) {
      // Catch any error during parsing
      // Check if it's specifically a YAMLException or similar parsing error
      if (e.name === "YAMLException" || e.message.includes("YAML")) {
        setParseError(
          `YAML Front Matter Error: ${
            e.reason || e.message
          }. Please check your syntax, especially quotes.`
        );
      } else {
        setParseError(`An unexpected error occurred: ${e.message}`);
      }
      // Set content to empty or previous valid content to avoid rendering bad data
      setMetadata({}); // Clear metadata on error
      setReactContent(""); // Clear rendered content on error
      return; // Stop execution if parsing failed
    }

    // If parsing was successful, proceed to render markdown
    setMetadata(parsedMetadata);
    setReactContent(parsedMarkdown);
  }, [md]);

  async function uploadBlog() {
    setLoading(true);
    try {
      const response = await createBlogPost({
        title: metadata.title || "Untitled",
        desc: metadata.desc || "No description provided",
        publishedAt: new Date(metadata.date) || new Date(),
        authors: metadata.authors || ["Anonymous"],
        authorId: currentUser?._id.toString() || "",
        tags: metadata.tags || [],
        cover: metadata.cover || "",
        file: new File([md], `${metadata.title || "untitled"}.md`, {
          type: "text/markdown",
        }), // Convert markdown to File
      });
      if (response.id) {
        toast.success("Blog uploaded successfully!");
      } else {
        throw new Error("Failed to upload blog");
      }
    } catch (error: any) {
      console.error("Error uploading blog:", error);
      toast.error(`Failed to upload blog: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded || !user) {
    <section>
      <div className="w-full flex flex-col md:sticky md:top-0 md:w-2/3 md:h-dvh h-[95dvh] p-4 bg-base-200">
        <div className="skeleton textarea textarea-primary textarea-xs w-full h-full"></div>
        <div className="skeleton btn btn-primary mt-2">Loading...</div>
      </div>
    </section>;
  }

  if (!currentUser) {
    return (
      <section className="w-full flex justify-center items-center h-screen">
        <span className="loading loading-spinner"></span>
      </section>
    );
  }

  return (
    <section className="flex md:flex-row flex-col w-full h-fit">
      <div className="w-full flex flex-col md:sticky md:top-0 md:w-2/3 md:h-dvh h-[95dvh] p-4 bg-base-200">
        {" "}
        {/* Added flex-col for better layout with error */}
        <textarea
          placeholder={`---
            title: "The \"Escaped\" Example Title"
            date: "2025-05-20"
            authors: ["Alex Chen", "Priya Kumar"]
            tags: ["JavaScript", "Web Development", "Frontend"]
            ---`}
          className="textarea textarea-primary textarea-xs w-full h-full"
          onChange={(e) => setMd(e.target.value)}
          value={md}
        ></textarea>
        {/* Display parsing error message */}
        {parseError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mt-2">
            {parseError}
          </div>
        )}
        <button
          className="btn btn-primary mt-2"
          onClick={uploadBlog}
          disabled={!metadata.title || !reactContent || loading}
        >
          Upload Blog
        </button>
      </div>
      <div className="blog w-full px-4 md:px-2 md:pr-6 pb-20 overflow-y-hidden">
        {metadata.cover && (
          <div className="aspect-[3/1] overflow-hidden">
            <img
              src={metadata.cover}
              alt="cover image"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Display metadata only if title exists to avoid empty tags on initial render */}
        {metadata.title && <h1>{metadata.title}</h1>}
        {metadata.date && (
          <p className="text-sm text-base-content/50">
            {metadata.date} — by {metadata.authors?.join(", ")}
          </p>
        )}
        {(metadata.title || metadata.date) && <hr />}{" "}
        {/* Show HR only if content above it */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {reactContent}
        </ReactMarkdown>
      </div>
    </section>
  );
}
