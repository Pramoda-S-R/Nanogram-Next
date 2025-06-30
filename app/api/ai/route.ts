import { withAuth } from "@/lib/apiauth";
import { NextRequest, NextResponse } from "next/server";
import { assistantAI } from "@/bot/guideBot";

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const { chatHistory, query } = await req.json();

      const aiRes = await assistantAI({ chatHistory, query });

      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of aiRes) {
              if (chunk.text) {
                controller.enqueue(encoder.encode(chunk.text));
              }
            }
          } catch (e) {
            console.error("Streaming error:", e);
          } finally {
            controller.close();
          }
        },
      });

      return new NextResponse(stream, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (err) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to process request",
          details: String(err),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
  { adminOnly: true }
);
