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
      `${BASE_URL}/api/account/profile?user_id=${userId}`,
      {
        method: "PUT",
        headers: {
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
// Update username
export async function updateUsernameById({
  userId,
  username,
}: {
  userId: string;
  username: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/account/username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
      },
      body: JSON.stringify({ userId, username }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error(errorData.error || "Failed to update username");
    }

    console.log("Username updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating username:", error);
    return false;
  }
}
// Remove user profile image
export async function removeUserProfileImage(userId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/account/profile?user_id=${userId}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove user profile image");
    }

    console.log("User profile image removed successfully");
    return true;
  } catch (error) {
    console.error("Error removing user profile image:", error);
    return false;
  }
}
// Update user email
export async function updateUserEmail({
  userId,
  primaryEmailAddressID,
}: {
  userId: string;
  primaryEmailAddressID: string;
}): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("primaryEmailAddressID", primaryEmailAddressID);

    const response = await fetch(
      `${BASE_URL}/api/account/email?user_id=${userId}`,
      {
        method: "PUT",
        headers: {
          "x-api-key": apiKey || "",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update user email");
    }

    console.log("User email updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user email:", error);
    return false;
  }
}
// Delete user email
export async function deleteEmailById({
  emailAddressID,
}: {
  emailAddressID: string;
}): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/account/email?email_address_id=${emailAddressID}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete user email");
    }
    console.log("User email deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting user email:", error);
    return false;
  }
}
// Revoke user session
export async function revokeUserSession(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/account/sessions?session_id=${sessionId}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to revoke user session");
    }

    console.log("User session revoked successfully");
    return true;
  } catch (error) {
    console.error("Error revoking user session:", error);
    return false;
  }
}
// Change user password TODO: Not Working
export async function changeUserPassword({
  currentPassword,
  newPassword,
  signOutOfOtherSessions,
}: {
  currentPassword: string;
  newPassword: string;
  signOutOfOtherSessions: boolean;
}): Promise<boolean> {
  const formData = new FormData();
  formData.append("currentPassword", currentPassword);
  formData.append("newPassword", newPassword);
  formData.append("signOutOfOtherSessions", signOutOfOtherSessions.toString());
  try {
    const response = await fetch(`${BASE_URL}/api/account/password`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to change password");
    }

    console.log("Password changed successfully");
    return true;
  } catch (error) {
    console.error("Error changing password:", error);
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
