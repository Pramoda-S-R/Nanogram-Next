import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";

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
      const formData = await req.formData();
      const currentPassword = formData.get("currentPassword") as string;
      const newPassword = formData.get("newPassword") as string;
      const signOutOfOtherSessions =
        formData.get("signOutOfOtherSessions") === "true";

      const { user } = useUser();
      await user?.updatePassword({
        currentPassword,
        newPassword,
        signOutOfOtherSessions,
      });
      return NextResponse.json(
        { message: "Password updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }
  }
  if (update === "username") {
    try {
      const userId = searchParams.get("user_id");
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }
      const username = searchParams.get("username");
      if (!username) {
        return NextResponse.json(
          { error: "Username is required" },
          { status: 400 }
        );
      }

      const client = await clerkClient();
      const { isSignedIn } = await client.authenticateRequest(req, {
        authorizedParties: ["http://localhost:3000"],
      });

      if (!isSignedIn) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Update user username
      const res = await client.users.updateUser(userId, {
        username,
      });

      return NextResponse.json(
        { message: "Username updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update username" },
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
