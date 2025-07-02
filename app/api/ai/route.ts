import { withAuth } from "@/lib/apiauth";
import { NextRequest, NextResponse } from "next/server";
import { assistantAI } from "@/bot/guideBot";
import { Content } from "@google/genai";

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const { chatHistory, query } = await req.json();
      const history: Content[] = chatHistory || [];

      if (!chatHistory || !query) {
        return NextResponse.json(
          { error: "Chat history and query are required." },
          { status: 400 }
        );
      }

      const response = await assistantAI({
        chatHistory: history,
        query,
      });

      return NextResponse.json({ answer: response });
    } catch (error: any) {
      return NextResponse.json(
        {
          error: "An error occurred while processing your request.",
          details: error.message,
        },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);
