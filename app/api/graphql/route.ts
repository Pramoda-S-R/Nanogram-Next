import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { join } from "path";
import { resolvers } from "@/lib/graphql/resolvers";
import clientPromise from "@/lib/mongodb";
import type { GraphQLContext } from "@/types";

const database: string | undefined = process.env.DATABASE;

const typeDefs = readFileSync(
  join(process.cwd(), "lib/graphql/schema.graphql"),
  "utf8"
);

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

export const GET = startServerAndCreateNextHandler(server, {
  context: async () => {
    const client = await clientPromise;
    return {
      db: client.db(database),
      mongoClient: client,
    };
  },
});

export const POST = GET;
