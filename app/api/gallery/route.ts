import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { withAuth } from "@/lib/apiauth";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const maxResults = parseInt(
      req.nextUrl.searchParams.get("max_results") || "10"
    );
    const resources = await cloudinary.api.resources_by_asset_folder(
      "nanogram/gallery",
      { next_cursor: cursor, max_results: maxResults }
    );

    return NextResponse.json(resources, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch gallery resources", details: error.message },
      { status: 500 }
    );
  }
});
