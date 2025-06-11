import { NextRequest, NextResponse } from "next/server";
import clientPromise from "./mongodb";

const database: string | undefined = process.env.DATABASE;

export function withDevAuth(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 401 });
    }

    const client = await clientPromise;
    const dev = await client
      .db(database)
      .collection("developers")
      .findOne({ apiKey: apiKey });

    if (!dev) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
    }

    return handler(req);
  };
}

export function withAdminAuth(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 401 });
    }

    const client = await clientPromise;
    const dev = await client.db().collection("developers").findOne({ apiKey });

    if (!dev) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
    }

    if (dev.tier !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(req);
  };
}
