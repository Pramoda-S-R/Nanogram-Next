import { getMD } from "@/lib/blog";
import React from "react";
import { useRemarkSync } from "react-remark";
import "../../../../styles/blog.css"

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const url = new URL(
    "https://raw.githubusercontent.com/Pramoda-S-R/AnimeSesh/main/README.md"
  );
  const markdown = await getMD(url);
  const reactContent = useRemarkSync(markdown);

  return <div className="w-3xl h-svh overflow-y-scroll blog">{reactContent}</div>;
}
