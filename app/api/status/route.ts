import { parseStatus } from "@/bot/parseStatus";
import { withAuth } from "@/lib/apiauth";
import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

const FEEDS = {
  mongodb: "https://status.mongodb.com/history.rss",
  cloudinary: "https://status.cloudinary.com/history.rss",
  uploadthing: "https://uploadthingstatus.com/history.rss",
  clerk: "https://status.clerk.com/history.rss",
  upstash: "https://status.upstash.com/history.rss",
  //   ably: 'https://status.ably.com/history.rss',
  //   airtable: 'https://status.airtable.com/history.rss',
  //   mailjet: 'https://status.mailjet.com/history.rss',
};

// Route handler (GET only)
export const GET = withAuth(async () => {
  try {
    const statuses = await Promise.all(
      Object.entries(FEEDS).map(async ([name, url]) => {
        const feed = await parser.parseURL(url);
        const latest = feed.items[0];

        const parsedDate = new Date(latest?.pubDate || "");

        const res = await parseStatus(latest?.description);
        const status = JSON.parse(res);

        return {
          service: name,
          title: latest?.title,
          status: status.status || "Unknown",
          date: parsedDate,
          link: latest?.link,
        };
      })
    );

    return NextResponse.json({ statuses }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch feeds", details: String(err) },
      { status: 500 }
    );
  }
});
