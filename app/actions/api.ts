// app/actions/fetchData.ts
"use server";
import {
  AggregatePost,
  BlogPost,
  BlogSchema,
  Event,
  Nanogram,
  Newsletters,
  Post,
  Testimonial,
  User,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

// ===================
// User Functions
// ===================
// Get all users
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/user`, {
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
      next: {
        revalidate: 60, // Revalidate every 60 seconds
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
    const response = await fetch(`${BASE_URL}/api/blog`, {
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

// ====================
// Newsletter Functions
// ====================
// Get all newsletters
export async function getAllNewsletters(): Promise<Newsletters[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter`, {
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
