import { QdrantClient } from "@qdrant/js-client-rest";

const API_KEY = process.env.QDRANT_API_KEY || "";

// or connect to Qdrant Cloud
export const qdrantClient = new QdrantClient({
  url: "https://68866a33-c2b7-47de-b46c-c416f28f6476.eu-central-1-0.aws.cloud.qdrant.io",
  apiKey: API_KEY,
});
