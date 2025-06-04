import { NextRequest, NextResponse } from "next/server";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  const { userId, getToken } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await getToken({ template: "default" });

    const formData = await req.formData();
    const _clerk_session_id = formData.get("_clerk_session_id") as string;
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const signOutOfOtherSessions = formData.get(
      "signOutOfOtherSessions"
    ) as string;

    const client = await clerkClient();

    const res = await fetch(
      `https://apparent-martin-67.clerk.accounts.dev/v1/me/change_password?_clerk_session_id=${_clerk_session_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          current_password: currentPassword,
          new_password: newPassword,
          sign_out_of_other_sessions: signOutOfOtherSessions,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData?.errors?.[0]?.message || "Password update failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
