import matter from "gray-matter";

export async function getMD(url: URL) {
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const raw = await res.text();

  const { data: metadata, content: markdown } = matter(raw);

  return { metadata, markdown };
}
