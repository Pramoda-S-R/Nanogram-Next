import { qdrantClient } from "@/lib/qdrant";
import { mongoToUUID } from "@/utils";
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "";

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateEmbeddings = async (text: string) => {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-exp-03-07",
      contents: text,
      config: {
        taskType: "SEMANTIC_SIMILARITY",
        outputDimensionality: 768,
      },
    });

    return response.embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings");
  }
};

export const generateImageCaption = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const imageArrayBuffer = await response.arrayBuffer();
    const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64ImageData,
          },
        },
        {
          text: "Caption this image. simple text, no emoji or symbols, keep it short and descriptive nut make sure to point out every small detail.",
        },
      ],
    });

    return result.text;
  } catch (error) {
    console.error("Error generating image caption:", error);
    throw new Error("Failed to generate image caption");
  }
};

export const onPost = async (post: any, update?: boolean) => {
  try {
    if (!post || !post.caption || !post._id) {
      throw new Error("Post, caption and _id are required");
    }
    if (update) {
      // If this is an update, we need to delete the old embeddings first
      await qdrantClient.delete("posts", {
        points: [mongoToUUID(post._id)],
      });
    }
    const content = post.caption;
    let imageCaption = "";
    if (post.imageUrl) {
      imageCaption = (await generateImageCaption(post.imageUrl)) || "";
    }

    const embeddings = await generateEmbeddings(
      post.caption + "\n" + imageCaption
    );

    if (!embeddings || !embeddings[0]?.values) {
      throw new Error("Failed to generate embeddings");
    }

    await qdrantClient.upsert("posts", {
      points: [
        {
          id: mongoToUUID(post._id),
          vector: embeddings[0].values,
          payload: {
            _id: post._id,
            caption: post.caption,
            imageCaption: imageCaption,
            imageUrl: post.imageUrl,
          },
        },
      ],
    });
  } catch (error) {
    console.log("Error creating post:", error);
  }
};

export const searchPosts = async (query: string, limit = 10) => {
  try {
    const embeddings = await generateEmbeddings(query);
    if (!embeddings || !embeddings[0]?.values) {
      throw new Error("Failed to generate embeddings for the query");
    }
    const response = await qdrantClient.search("posts", {
      vector: embeddings[0].values,
      limit: limit,
    });

    return response;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error("Failed to search posts");
  }
};
