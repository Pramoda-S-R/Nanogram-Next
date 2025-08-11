import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { join } from "path";
import { resolvers } from "@/lib/graphql/resolvers";
import clientPromise from "@/lib/mongodb";
import type { GraphQLContext } from "@/types";
import { Redis } from "@upstash/redis";
import { Duration, Ratelimit } from "@upstash/ratelimit";
import { Developers } from "@/types/mongodb";
import { createRateLimitPlugin } from "@/lib/graphql/authContext";

const database: string | undefined = process.env.DATABASE;

const typeDefs = readFileSync(
  join(process.cwd(), "lib/graphql/schema.graphql"),
  "utf8"
);

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  plugins: [createRateLimitPlugin()],
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const tierLimits: Record<string, { limit: number; interval: Duration }> = {
  free: { limit: 60, interval: "1 m" },
  admin: { limit: 1000, interval: "1 m" },
};

export const GET = startServerAndCreateNextHandler<Request, GraphQLContext>(
  server,
  {
    context: async (req: Request): Promise<GraphQLContext> => {
      const client = await clientPromise;

      const apiKey = req.headers.get("x-api-key");
      if (!apiKey) throw new Error("API key missing");

      const dev = await client
        .db(database)
        .collection<Developers>("developers")
        .findOne({ apiKey });

      if (!dev) throw new Error("Invalid API key");

      const tier = dev.tier || "free";
      const limits = tierLimits[tier] || tierLimits.free;

      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(limits.limit, limits.interval),
      });

      const { success, reset, remaining } = await ratelimit.limit(
        dev._id.toString()
      );

      if (!success) {
        throw new Error(
          `Rate limit exceeded. Retry after ${new Date(reset).toLocaleString()}`
        );
      }

      return {
        db: client.db(database),
        mongoClient: client,
        dev,
        role: dev.tier,
        rateLimit: { limit: limits.limit, remaining, reset },
      };
    },
  }
);

export const POST = GET;
