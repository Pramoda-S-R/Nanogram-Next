import { withAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { Message } from "@/types";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const senderId = searchParams.get("senderId");
    const conversationId = searchParams.get("id");
    const receiverId = searchParams.get("receiverId");
    const seen = searchParams.get("seen") === "true";
    const sort = searchParams.get("sort") || "updatedAt";
    const order = parseInt(searchParams.get("order") || "-1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");
    const query: any = {};
    if (senderId && receiverId) {
      const senderObjId = new ObjectId(senderId);
      const receiverObjId = new ObjectId(receiverId);

      query["$or"] = [
        {
          "sender._id": senderObjId,
          "receiver._id": receiverObjId,
        },
        {
          "sender._id": receiverObjId,
          "receiver._id": senderObjId,
        },
      ];
    }

    const client = await clientPromise;
    const cursor = client
      .db(database)
      .collection<Message>("messages")
      .find(query);
    if (sort) {
      cursor.sort({ [sort]: order } as Record<string, 1 | -1>);
    }
    if (limit > 0) {
      cursor.limit(limit);
    }

    const messages = await cursor.toArray();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
