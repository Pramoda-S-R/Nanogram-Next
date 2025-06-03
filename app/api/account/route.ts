import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

export async function PUT(req: NextRequest) {
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKey && apiKeyHeader !== apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const update = searchParams.get("update");
  if (update === "password") {
    try {
      const client = await clerkClient();
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }
  }
  if (update === "profile") {
    try {
      const client = await clerkClient();
      const userId = searchParams.get("user_id");
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }
      const body = await req.json();
      console.log("Updating profile for user:", body);
      const { firstName, lastName, file } = body;

      // Update user profile
      await client.users.updateUser(userId, {
        firstName,
        lastName,
      });
      await client.users.updateUserProfileImage(userId, {
        file,
      });

      return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Invalid update type" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKey && apiKeyHeader !== apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const client = await clerkClient();
    client.users.deleteUser(userId);
    return Response.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error deleting user" }, { status: 500 });
  }
}
