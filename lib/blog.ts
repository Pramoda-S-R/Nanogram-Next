export async function getMD(url: URL): Promise<string> {
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch markdown from ${url}`);
  }
  return res.text();
}
