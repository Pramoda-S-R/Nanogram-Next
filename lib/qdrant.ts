import { QdrantClient } from "@qdrant/js-client-rest";

const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "";
const QDRANT_ENDPOINT = process.env.QDRANT_CLUSTER_ENDPOINT || "";

// or connect to Qdrant Cloud
export const qdrantClient = new QdrantClient({
  url: QDRANT_ENDPOINT,
  apiKey: QDRANT_API_KEY,
});
