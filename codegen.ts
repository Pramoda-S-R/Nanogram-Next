import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "lib/graphql/schema.graphql",
  generates: {
    "lib/graphql/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "@/types#GraphQLContext",
        avoidOptionals: true,
        enumsAsTypes: true,
        scalars: {
          Date: "Date",
          ObjectId: "import('mongodb').ObjectId",
        },
      },
    },
  },
};

export default config;
