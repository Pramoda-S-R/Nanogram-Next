import { getMD } from "@/app/(public)/blog/[blog_id]/page";
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

export const searchPosts = async (query: string, limit = 3) => {
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

export const similarPosts = async (postId: string, limit = 3) => {
  try {
    if (!postId) {
      throw new Error("Post ID is required");
    }
    const searchResults = await qdrantClient.query("posts", {
      query: {
        recommend: {
          positive: [mongoToUUID(postId)], // your reference item ID(s)
          strategy: "average_vector", // or "best_score"
        },
      },
      limit,
      with_payload: true,
      with_vector: false,
    });

    return searchResults.points;
  } catch (error) {
    console.error("Error finding similar posts:", error);
    throw new Error("Failed to find similar posts");
  }
};

export const deletePostVectors = async (postId: string) => {
  try {
    if (!postId) {
      throw new Error("Post ID is required");
    }
    await qdrantClient.delete("posts", {
      points: [mongoToUUID(postId)],
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
};

export const summarizeBlog = async (fileUrl: string) => {
  try {
    if (!fileUrl) {
      throw new Error("Blog and fileUrl are required");
    }
    const { metadata, markdown } = await getMD(new URL(fileUrl));
    const content = `Context:${metadata}\n${markdown}\n\nUser: Summarize this blog post in a few sentences.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing blog:", error);
    throw new Error("Failed to summarize blog");
  }
};

export const onBlog = async (blog: any, update?: boolean) => {
  try {
    if (!blog || !blog.fileUrl || !blog._id) {
      throw new Error("Blog, fileUrl and _id are required");
    }
    if (update) {
      // If this is an update, we need to delete the old embeddings first
      await qdrantClient.delete("blogs", {
        points: [mongoToUUID(blog._id)],
      });
    }
    const summary = await summarizeBlog(blog.fileUrl);
    if (!summary) {
      throw new Error("Failed to summarize the blog");
    }
    const embeddings = await generateEmbeddings(summary);

    if (!embeddings || !embeddings[0]?.values) {
      throw new Error("Failed to generate embeddings for the blog");
    }

    await qdrantClient.upsert("blogs", {
      points: [
        {
          id: mongoToUUID(blog._id),
          vector: embeddings[0].values,
          payload: {
            _id: blog._id,
            summary: summary,
            title: blog.title,
            desc: blog.desc,
            cover: blog.cover,
            route: blog.route,
            fileUrl: blog.fileUrl,
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error processing blog:", error);
    throw new Error("Failed to process blog");
  }
};

export const searchBlogs = async (query: string, limit = 3) => {
  try {
    const embeddings = await generateEmbeddings(query);
    if (!embeddings || !embeddings[0]?.values) {
      throw new Error("Failed to generate embeddings for the query");
    }
    const response = await qdrantClient.search("blogs", {
      vector: embeddings[0].values,
      limit: limit,
    });

    return response;
  } catch (error) {
    console.error("Error searching blogs:", error);
    throw new Error("Failed to search blogs");
  }
};

export const deleteBlogVectors = async (blogId: string) => {
  try {
    if (!blogId) {
      throw new Error("Blog ID is required");
    }
    await qdrantClient.delete("blogs", {
      points: [mongoToUUID(blogId)],
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Failed to delete blog");
  }
};
