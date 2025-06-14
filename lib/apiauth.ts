// lib/withAuth.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "./mongodb";
import { Redis } from "@upstash/redis";
import { Duration, Ratelimit } from "@upstash/ratelimit";

const database = process.env.DATABASE;

// Upstash Redis setup
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Define per-tier rate limits
const tierLimits: Record<string, { limit: number; interval: Duration }> = {
  free: { limit: 60, interval: "1 m" },
  admin: { limit: 1000, interval: "1 m" },
};

/**
 * A higher-order handler that authenticates developers and applies rate limits.
 * @param handler The API handler function
 * @param options Optional config for requiring admin access
 * @returns A wrapped Next.js API handler with auth and rate limiting
 */
export function withAuth(
  handler: (req: NextRequest, dev: any) => Promise<NextResponse>,
  options: { adminOnly?: boolean } = {}
) {
  return async (req: NextRequest) => {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 401 });
    }

    // MongoDB: find developer by API key
    const client = await clientPromise;
    const dev = await client
      .db(database)
      .collection("developers")
      .findOne({ apiKey });

    if (!dev) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
    }

    const tier = dev.tier || "free";

    // If admin-only route and dev is not admin, deny access
    if (options.adminOnly && tier !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Apply rate limiting
    const limits = tierLimits[tier] || tierLimits["free"];
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(limits.limit, limits.interval),
    });

    const { success, reset, remaining } = await ratelimit.limit(
      dev._id.toString()
    );

    if (!success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: reset,
        },
        { status: 429 }
      );
    }

    // Attach headers (optional – for internal use or logging)
    req.headers.set("x-dev-id", dev._id.toString());
    req.headers.set("x-dev-tier", tier);
    req.headers.set("x-dev-userid", dev.userId.toString() || "");
    req.headers.set("x-dev-appname", dev.appName || "");

    const response = await handler(req, dev);

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", limits.limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString()); // this is a UNIX timestamp

    return response;
  };
}
