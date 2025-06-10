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
    const primaryEmailAddressID = formData.get(
      "primaryEmailAddressID"
    ) as string;

    const client = await clerkClient();

    // Update user profile
    await client.users.updateUser(userId, {
      primaryEmailAddressID,
    });

    return NextResponse.json(
      { message: "Email updated successfully" },
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
  const emailAddressID = searchParams.get("email_address_id");
  if (!emailAddressID) {
    return NextResponse.json(
      { error: "Email Address ID is required" },
      { status: 400 }
    );
  }
  try {
    const client = await clerkClient();

    client.emailAddresses.deleteEmailAddress(emailAddressID);

    return NextResponse.json(
      { message: "Email deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to delete email, error${error.message}` },
      { status: 500 }
    );
  }
}
