import { Developers } from "@/types/mongodb";
import { GraphQLError } from "graphql";
import { WithId } from "mongodb";

import { ApolloServerPlugin } from "@apollo/server";
import type { GraphQLContext } from "@/types";

export function createRateLimitPlugin(): ApolloServerPlugin<GraphQLContext> {
  return {
    async requestDidStart() {
      return {
        async willSendResponse(requestContext) {
          const { rateLimit } = requestContext.contextValue;

          if (rateLimit && requestContext.response.http) {
            requestContext.response.http.headers.set(
              "X-RateLimit-Limit",
              rateLimit.limit.toString()
            );
            requestContext.response.http.headers.set(
              "X-RateLimit-Remaining",
              rateLimit.remaining.toString()
            );
            requestContext.response.http.headers.set(
              "X-RateLimit-Reset",
              rateLimit.reset.toString()
            );
          }
        },
      };
    },
  };
}

export function requireRole(ctx: WithId<Developers>, allowedRoles: string[]) {
  if (!allowedRoles.includes(ctx.tier)) {
    throw new GraphQLError(
      "You do not have permission to perform this action",
      {
        extensions: {
          code: "FORBIDDEN",
          http: { status: 403 },
        },
      }
    );
  }
}
