import { ably } from "@/lib/ably";
import { withAuth } from "@/lib/apiauth";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const searchParams = req.nextUrl.searchParams;
      const clientId = searchParams.get("client");
      if (!clientId) {
        return NextResponse.json(
          { error: "Client ID is required" },
          { status: 400 }
        );
      }

      const tokenRequest = await ably.auth.createTokenRequest({
        clientId: clientId,
      });
      return NextResponse.json(
        { tokenRequest },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);
