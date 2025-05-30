import { getMD } from "@/lib/blog";
import React from "react";
import { useRemarkSync } from "react-remark";
import "../styles/blog.css";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) {
  const { blog_id } = await params;
  const url = new URL(
    "https://gist.githubusercontent.com/Pramoda-S-R/8d952a1d05cc80b2984fd28a58772f76/raw/3f13756401786402d7227f1228f651ef6cf37f9b/test.md"
  );
  const { metadata, markdown } = await getMD(url);
  const reactContent = useRemarkSync(markdown);

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
      {reactContent}
    </div>
  );
}
