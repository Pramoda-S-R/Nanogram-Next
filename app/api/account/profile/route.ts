import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

export async function PUT(req: NextRequest) {
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKey && apiKeyHeader !== apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const formData = await req.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const file = formData.get("file") as File;

    // console.log("file: ", file);
    const client = await clerkClient();

    // Update user profile
    await client.users.updateUser(userId, {
      firstName,
      lastName,
    });
    if (file) {
      await client.users.updateUserProfileImage(userId, {
        file,
      });
    }

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
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
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const client = await clerkClient();

    // Delete user profile image
    await client.users.deleteUserProfileImage(userId);
    
    return NextResponse.json(
      { message: "Profile image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete profile, ${error}` },
      { status: 500 }
    );
  }
}
