// app/actions/api.ts
"use server";
import { searchBlogs, searchPosts, similarPosts } from "@/bot/vectorSearch";
import {
  AggregateComment,
  AggregatePost,
  BlogPost,
  BlogSchema,
  Comment,
  Event,
  Message,
  Messager,
  Nanogram,
  Newsletters,
  Post,
  SharedPost,
  Testimonial,
  User,
} from "@/types";
import { ResourceApiResponse } from "cloudinary";
import { ObjectId } from "mongodb";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const ANONYMOUS_USER_ID =
  process.env.ANONYMOUS_USER_ID || "686658c02a2faecbc084642b";
const apiKey: string | undefined = process.env.ADMIN_KEY;

// ===================
// User Functions
// ===================
// Get all users
export async function getNewUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/user?order=-1`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.documents as User[];
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}
// Check if user exists by ID
export async function userExistsById(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/user?user_id=${userId}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents.length > 0;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
}
// Add user to db
export async function addUserToDb({
  userId,
  username,
  firstName,
  lastName,
  email,
  bio,
  avatarUrl,
}: {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("username", username);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);

    if (bio) {
      formData.append("bio", bio);
    }
    if (avatarUrl) {
      formData.append("avatarUrl", avatarUrl);
    }
    const response = await fetch(`${BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to add user to database");
    }

    console.log("User added to database successfully");
    return true;
  } catch (error) {
    console.error("Error adding user to database:", error);
    return false;
  }
}
// Get user by username
export async function getUserByUsername({
  username,
}: {
  username: string;
}): Promise<User | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/user?username=${username}&limit=1`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
        cache: "no-store", // Disable caching for this request
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.documents.length > 0 ? data.documents[0] : null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}
// Search users by name or username
export async function searchUsers(name: string): Promise<User[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/user?name=${encodeURIComponent(name)}&limit=10`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // Revalidate every 60 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as User[];
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}
// Get current user
export async function getCurrentUser({
  user_id,
}: {
  user_id: string;
}): Promise<User | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/user?user_id=${user_id}&limit=1`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // Revalidate every 60 seconds
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.documents.length > 0 ? data.documents[0] : null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
// Get user by Id array
export async function getUsersByIds(userIds: string[]): Promise<User[]> {
  try {
    if (userIds.length === 0) {
      return [];
    }
    const params = userIds.map((id) => `id=${id}`).join("&");
    const response = await fetch(`${BASE_URL}/api/user?${params}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
      next: {
        revalidate: 60, // Revalidate every 60 seconds
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as User[];
  } catch (error) {
    console.error("Error fetching users by IDs:", error);
    return [];
  }
}
// Follow a user
export async function followUser({
  userId,
  followUserId,
}: {
  userId: string;
  followUserId: string;
}): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("followUserId", followUserId);
    const response = await fetch(`${BASE_URL}/api/user/follow`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error following user:", error);
    return false;
  }
}

// ==================
// Post Functions
// ==================
// Create a new post
export async function createPost({
  userId,
  caption,
  tags,
  file,
}: {
  userId: string;
  caption: string;
  tags?: string[];
  file?: File;
}): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) {
      formData.append("image", file);
    }
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        formData.append("tags", tag);
      });
    }
    const userResponse = await fetch(
      `${BASE_URL}/api/user?user_id=${userId}&limit=1`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
    }
    const userData = await userResponse.json();
    if (userData.documents.length === 0) {
      throw new Error("User not found");
    }
    formData.append("creator", userData.documents[0]._id);
    const response = await fetch(`${BASE_URL}/api/posts`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}
// Read a post by ID
export async function getPostById(
  postId: string
): Promise<AggregatePost | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/posts?id=${postId}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents.length > 0 ? data.documents[0] : null;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}
// Update an existing post
export async function updatePost({
  postId,
  caption,
  tags,
  file,
}: {
  postId: string;
  caption: string;
  tags?: string[];
  file?: File;
}): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("id", postId);
    formData.append("caption", caption);
    if (file) {
      formData.append("image", file);
    }
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        formData.append("tags", tag);
      });
    }
    console.log("Updating Post:", {
      postId,
      formData,
    });
    const response = await fetch(`${BASE_URL}/api/posts`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}
// Delete a post by ID
export async function deletePostById(postId: string): Promise<boolean> {
  try {
    const commentDeleteResponse = await fetch(
      `${BASE_URL}/api/posts/comment?postId=${postId}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );

    if (!commentDeleteResponse.ok) {
      throw new Error(
        `Failed to delete comments for post ${postId}: ${commentDeleteResponse.statusText}`
      );
    }

    const response = await fetch(`${BASE_URL}/api/posts?id=${postId}`, {
      method: "DELETE",
      headers: {
        "x-api-key": apiKey || "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Post deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}
// Get FYP posts
export async function getFypPosts(): Promise<AggregatePost[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/posts?sort=createdAt&order=-1&limit=25`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as AggregatePost[];
  } catch (error) {
    console.error("Error fetching FYP posts:", error);
    return [];
  }
}
// Get posts by post _id array
export async function getPostsByIds(
  postIds: string[]
): Promise<AggregatePost[]> {
  try {
    if (postIds.length === 0) {
      return [];
    }
    const params = postIds.map((id) => `id=${id}`).join("&");
    const response = await fetch(`${BASE_URL}/api/posts?${params}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as AggregatePost[];
  } catch (error) {
    console.error("Error fetching posts by IDs:", error);
    return [];
  }
}
// Like a post
export async function likePost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("userId", userId);
    const response = await fetch(`${BASE_URL}/api/posts/like`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error liking post:", error);
    return false;
  }
}
// Save a post
export async function savePost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("userId", userId);
    const response = await fetch(`${BASE_URL}/api/posts/save`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error saving post:", error);
    return false;
  }
}
// Get posts infinite scroll with params
export async function getPostsInfiniteScroll({
  sortBy,
  limit = 10,
  skip = 0,
}: {
  sortBy: string;
  limit?: number;
  skip?: number;
}): Promise<AggregatePost[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/posts?sort=${sortBy}&limit=${limit}&skip=${skip}`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.documents as AggregatePost[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}
// Get posts by tags
export async function getPostsByTags({
  tags,
  limit = 10,
}: {
  tags: string[];
  limit?: number;
}): Promise<AggregatePost[]> {
  try {
    if (tags.length === 0) {
      return [];
    }
    const params = tags.map((tag) => `tags=${tag}`).join("&");
    const response = await fetch(
      `${BASE_URL}/api/posts?${params}&sort=createdAt&order=-1&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // Revalidate every 60 seconds
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.documents as AggregatePost[];
  } catch (error) {
    console.error("Error fetching posts by tags:", error);
    return [];
  }
}
// Qdrant proxy
export async function getPostsFromQdrant(
  query: string,
  limit = 3
): Promise<any[]> {
  try {
    const response = await searchPosts(query, limit);
    if (!response || response.length === 0) {
      return [];
    }
    return response;
  } catch (error) {
    console.error("Error fetching posts from Qdrant:", error);
    return [];
  }
}
// Qdrant proxy for similar posts
export async function getSimilarPosts(
  postId: string,
  limit = 3
): Promise<any[]> {
  try {
    const response = await similarPosts(postId, limit);
    if (!response || response.length === 0) {
      return [];
    }
    return response;
  } catch (error) {
    console.error("Error fetching similar posts from Qdrant:", error);
    return [];
  }
}

// ===================
// Post Comment Functions
// ===================
// Create a new comment
export async function createComment({
  postId,
  commenter,
  content,
}: {
  postId: string;
  commenter: string;
  content: string;
}): Promise<ObjectId | boolean> {
  try {
    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("content", content);
    formData.append("commenter", commenter);

    const response = await fetch(`${BASE_URL}/api/posts/comment`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.commentId as ObjectId;
  } catch (error) {
    console.error("Error creating comment:", error);
    return false;
  }
}
// Get comments for a post
export async function getCommentsByPostId({
  postId,
  limit = 10,
  skip,
}: {
  postId: string;
  limit?: number;
  skip?: number;
}): Promise<AggregateComment[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/posts/comment?postId=${postId}&order=-1&sort=updatedAt&limit=${limit}${
        skip ? `&skip=${skip}` : ""
      }`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.documents as AggregateComment[];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}
// Delete a comment by ID
export async function deleteCommentById(commentId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/posts/comment?id=${commentId}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Comment deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
}
// Like a comment
export async function likeComment({
  postId,
  commentId,
  userId,
}: {
  postId: string;
  commentId: string;
  userId: string;
}): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("commentId", commentId);
    formData.append("userId", userId);
    const response = await fetch(`${BASE_URL}/api/posts/comment/like`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.log("Error liking comment:", error);
    return false;
  }
}

// ==================
// Message Functions
// ==================
// Get client token for Ably
export async function getAblyToken(clientId: string): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/api/ably?client=${clientId}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching Ably token:", error);
  }
}
// Get messages by sender and recipient
export async function getMessages({
  senderId,
  receiverId,
  limit,
  skip,
}: {
  senderId: string;
  receiverId: string;
  limit?: number;
  skip?: number;
}): Promise<Message[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/messages?senderId=${senderId}&receiverId=${receiverId}${
        skip ? `&skip=${skip}` : ""
      }${limit ? `&limit=${limit}` : ""}`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.messages as Message[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [] as Message[];
  }
}
// See a message
export async function markAsSeen({
  senderId,
  recipientId,
  messageId,
  updateWebSockect,
}: {
  senderId: string;
  recipientId: string;
  messageId: string;
  updateWebSockect?: boolean;
}): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/messages/seen`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
      },
      body: JSON.stringify({
        senderId,
        recipientId,
        messageId,
        updateWebSockect,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error marking message as seen:", error);
    return false;
  }
}
// Send a message
export async function sendMessage({
  sender,
  recipient,
  content,
}: {
  sender: Messager;
  recipient: Messager;
  content: { message: string | SharedPost };
}): Promise<Message | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
      },
      body: JSON.stringify({
        sender,
        recipient,
        content,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { messageSent } = await response.json();
    return messageSent as Message;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}
// React to a message
export async function reactToMessage({
  messageId,
  emoji,
  userId,
}: {
  messageId: string;
  emoji: string;
  userId: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/messages/send`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
      },
      body: JSON.stringify({
        messageId,
        emoji,
        userId,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.log("Error reacting to message:", error);
    return false;
  }
}
// Remove a reaction
export async function removeReaction({
  messageId,
  userId,
}: {
  messageId: string;
  userId: string;
}): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/messages/send?messageId=${messageId}&userId=${userId}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error removing reaction:", error);
    return false;
  }
}
// Delete a message
export async function deleteMessage({
  senderId,
  recipientId,
  messageId,
}: {
  senderId: string;
  recipientId: string;
  messageId: string;
}): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/messages/delete?senderId=${senderId}&recipientId=${recipientId}&messageId=${messageId}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
}

// ==================
// Nanogram Functions
// ==================
// Get nanograms for the hero section
export async function getHeroNanograms(): Promise<Nanogram[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/nanogram?core=true&sort=priority&order=1&limit=9`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // Revalidate every 60 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as Nanogram[];
  } catch (error) {
    console.error("Error fetching hero nanograms:", error);
    return [];
  }
}
// Get Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/nanogram?alumini=true&content=true&sort=priority&order=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // 1 minute
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents.map((doc: Testimonial) => ({
      id: doc._id,
      name: doc.name || "Anonymous",
      role: doc.role || "N/A",
      content: doc.content,
      avatarUrl: doc.avatarUrl || "/assets/images/placeholder.png", // Default placeholder
    }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}
// Get core members
export async function getCoreMembers(): Promise<Nanogram[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/nanogram?core=true&sort=priority&order=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // 1 minute
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.documents as Nanogram[];
  } catch (error) {
    console.error("Error fetching core members:", error);
    return [];
  }
}
// Get alumini members
export async function getAluminiMembers(): Promise<Nanogram[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/nanogram?alumini=true&sort=priority&order=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // 1 minute
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.documents as Nanogram[];
  } catch (error) {
    console.error("Error fetching alumini members:", error);
    return [];
  }
}
// Get all nanograms
export async function getAllNanograms(): Promise<Nanogram[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/nanogram?sort=priority&order=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // 1 minute
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as Nanogram[];
  } catch (error) {
    console.error("Error fetching all nanograms:", error);
    return [];
  }
}
// Create a new nanogram
export async function createNanogram({
  name,
  role,
  content,
  avatar,
  linkedin,
  github,
  instagram,
  alumini,
  core,
  priority,
}: {
  name: string;
  role: string;
  content?: string;
  avatar?: File;
  linkedin?: string;
  github?: string;
  instagram?: string;
  alumini?: boolean;
  core?: boolean;
  priority?: number;
}): Promise<ObjectId | boolean> {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    if (content) {
      formData.append("content", content);
    }
    if (avatar) {
      formData.append("avatar", avatar);
    }
    if (linkedin) {
      formData.append("linkedin", linkedin);
    }
    if (github) {
      formData.append("github", github);
    }
    if (instagram) {
      formData.append("instagram", instagram);
    }
    if (alumini) {
      formData.append("alumini", String(alumini));
    }
    if (core) {
      formData.append("core", String(core));
    }
    if (priority) {
      formData.append("priority", String(priority));
    }

    const response = await fetch(`${BASE_URL}/api/nanogram`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.id as ObjectId;
  } catch (error) {
    console.error("Error creating nanogram:", error);
    return false;
  }
}
// Update an existing nanogram
export async function updateNanogram({
  id,
  name,
  role,
  content,
  avatar,
  linkedin,
  github,
  instagram,
  alumini,
  core,
  priority,
}: {
  id: string;
  name: string;
  role: string;
  content?: string;
  avatar?: File;
  linkedin?: string;
  github?: string;
  instagram?: string;
  alumini?: boolean;
  core?: boolean;
  priority?: number;
}): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("role", role);
    if (content) {
      formData.append("content", content);
    }
    if (avatar) {
      formData.append("avatar", avatar);
    }
    if (linkedin) {
      formData.append("linkedin", linkedin);
    }
    if (github) {
      formData.append("github", github);
    }
    if (instagram) {
      formData.append("instagram", instagram);
    }
    if (alumini) {
      formData.append("alumini", String(alumini));
    }
    if (core) {
      formData.append("core", String(core));
    }
    if (priority) {
      formData.append("priority", String(priority));
    }
    const response = await fetch(`${BASE_URL}/api/nanogram`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error updating nanogram:", error);
    return false;
  }
}
// Delete a nanogram by ID
export async function deleteNanogramById(nanogramId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/nanogram?id=${nanogramId}`, {
      method: "DELETE",
      headers: {
        "x-api-key": apiKey || "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting nanogram:", error);
    return false;
  }
}

// ==================
// Event Functions
// ==================
// Get events for the event gallery
export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/events?completed=true&sort=date&order=-1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // 1 minute
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
// Get upcoming events
export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/events?completed=false&sort=date&order=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // 1 minute
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as Event[];
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}
// Get recent event
export async function getRecentEvent(): Promise<Event | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/events?completed=true&sort=date&order=-1&limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // 1 minute
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents.length > 0 ? (data.documents[0] as Event) : null;
  } catch (error) {
    console.error("Error fetching recent event:", error);
    return null;
  }
}
// Get next event
export async function getNextEvent(): Promise<Event | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/events?completed=false&sort=date&order=1&limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // 1 minute
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents.length > 0 ? (data.documents[0] as Event) : null;
  } catch (error) {
    console.error("Error fetching next event:", error);
    return null;
  }
}

// ===================
// Blog Functions
// ===================
// Create a new blog post
export async function createBlogPost({
  title,
  desc,
  publishedAt,
  authors,
  authorId,
  tags,
  cover,
  file,
}: BlogSchema): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("publishedAt", publishedAt.toISOString());
    formData.append("authors", JSON.stringify(authors));
    formData.append("authorId", authorId);
    formData.append("tags", JSON.stringify(tags));
    if (cover) {
      formData.append("cover", cover);
    }
    if (file) {
      formData.append("file", file);
    }
    const response = await fetch(`${BASE_URL}/api/blog`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create blog post");
    }

    const data = await response.json();
    // console.log("Blog post created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    return null;
  }
}
// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/blog?order=-1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
      },
      next: {
        revalidate: 60, // 1 minute
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}
// Get a single blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/blog?route=${id}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
      next: {
        revalidate: 60, // 1 minute
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents.length > 0 ? (data.documents[0] as BlogPost) : null;
  } catch (error) {
    console.error("Error fetching blog post by ID:", error);
    return null;
  }
}
// Qdrant proxy
export async function getBlogPostsByQdrant({
  query,
  limit = 10,
}: {
  query: string;
  limit?: number;
}): Promise<any[]> {
  try {
    const response = await searchBlogs(query, limit);
    return response;
  } catch (error) {
    console.error("Error fetching blog posts by Qdrant:", error);
    return [];
  }
}

// ====================
// Newsletter Functions
// ====================
// Get all newsletters
export async function getAllNewsletters(): Promise<Newsletters[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter?order=-1`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
      next: {
        revalidate: 60, // 1 minute
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents as Newsletters[];
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return [];
  }
}
// Get a newsletter by route
export async function getNewsletterByRoute(
  route: string
): Promise<Newsletters | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter?route=${route}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
      next: {
        revalidate: 60, // 1 minute
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.documents.length > 0
      ? (data.documents[0] as Newsletters)
      : null;
  } catch (error) {
    console.error("Error fetching newsletter by route:", error);
    return null;
  }
}

// ====================
// Report Functions
// ====================
// Report media function
export async function reportMedia({
  reporter,
  reportedUser,
  reportedMedia,
  mediaId,
  reason,
  details,
  status,
}: {
  reporter: string;
  reportedUser: string;
  reportedMedia: string;
  mediaId: string;
  reason: string;
  details: string;
  status: string;
}) {
  try {
    const formData = new FormData();
    formData.append("reporter", reporter);
    formData.append("reportedUser", reportedUser);
    formData.append("reportedMedia", reportedMedia);
    formData.append("mediaId", mediaId);
    formData.append("reason", reason);
    formData.append("details", details);
    formData.append("status", status);

    const response = await fetch(`${BASE_URL}/api/report`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error reporting media:", error);
    return false;
  }
}

// ====================
// Gallery Functions
// ====================
export async function getGalleryResources({
  cursor,
  maxResults,
}: {
  cursor?: string;
  maxResults?: number;
}): Promise<ResourceApiResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/gallery?${
        cursor && "cursor=" + cursor
      }&maxResults=${maxResults}`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey || "",
        },
        next: {
          revalidate: 60, // 1 minute
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data as ResourceApiResponse;
  } catch (error) {
    console.error("Error fetching gallery resources:", error);
    return {} as ResourceApiResponse;
  }
}

// ====================
// AI Functions
// ====================
export async function askNano({
  chatHistory,
  query,
}: {
  chatHistory: any[];
  query: string;
}): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/api/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
      },
      body: JSON.stringify({
        chatHistory,
        query,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.answer || "No response from Nano.";
  } catch (error) {
    console.error("Error asking Nano:", error);
    return "Nano is currently unavailable. Please try again later.";
  }
}
