import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

export async function PUT(req: NextRequest) {
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKey && apiKeyHeader !== apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const userId = body.userId as string;
    const username = body.username as string;

    if (!userId || !username) {
      return NextResponse.json(
        { error: "Missing userId or username" },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    // Update user username
    await client.users.updateUser(userId, {
      username,
    });
    return NextResponse.json(
      { message: "Username updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating username:", error);
    return NextResponse.json(
      {
        error: `Failed to update username: ${error.message || "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
