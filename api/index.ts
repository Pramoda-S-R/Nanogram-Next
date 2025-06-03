import { Event, Nanogram, Testimonial } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

// ==================
// User Functions
// ==================
// Delete user by ID
export async function deleteUserById(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/account?user_id=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    console.log("User deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}
// Update user profile
export async function updateUserProfile({
  userId,
  firstName,
  lastName,
  file,
}: {
  userId: string;
  firstName: string;
  lastName: string;
  file?: File;
}): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (file) {
      formData.append("file", file);
    }

    console.log("file: ", file);

    const response = await fetch(
      `${BASE_URL}/api/account?update=profile&user_id=${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
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
