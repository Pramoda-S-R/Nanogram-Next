import { withAuth } from "@/lib/apiauth";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (req: NextRequest) => {
  return NextResponse.json({ message: "Server is running", status: "ok" });
});
export const POST = withAuth(async (req: NextRequest) => {
  return NextResponse.json({ message: "Server is running", status: "ok" });
});
export const PUT = withAuth(async (req: NextRequest) => {
  return NextResponse.json({ message: "Server is running", status: "ok" });
});
export const DELETE = withAuth(async (req: NextRequest) => {
  return NextResponse.json({ message: "Server is running", status: "ok" });
});
