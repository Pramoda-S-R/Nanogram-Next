// /app/api/og/route.tsx
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl =
    searchParams.get("imageUrl") ||
    "http://localhost:3000/assets/images/nanogram_logo-twitter-card.png";
  const title = searchParams.get("title") || "Default Title";

  return new ImageResponse(
    (
      // Need to use raw css here because of the way Vercel handles CSS imports
      <div
        style={{
          fontSize: 60,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={imageUrl}
          alt="og-img"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
      },
    }
  );
}
