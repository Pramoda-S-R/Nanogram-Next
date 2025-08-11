import { ably } from "@/lib/ably";
import { withAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { Message } from "@/types/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;

export const PUT = withAuth(
  async (req: NextRequest) => {
    try {
      const { senderId, recipientId, messageId, updateWebSockect } =
        await req.json();
      if (!senderId || !recipientId || !messageId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      if (!messageId) {
        return NextResponse.json(
          { error: "Message ID is required" },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const result = await client
        .db(database)
        .collection<Message>("messages")
        .updateOne(
          { _id: new ObjectId(messageId as string) },
          { $set: { seen: true, updatedAt: new Date() } }
        );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: "Message not found or already updated" },
          { status: 404 }
        );
      }

      if (updateWebSockect) {
        const channelName = `dm-${[senderId, recipientId].sort().join("-")}`;
        const channel = ably.channels.get(channelName);
        await channel.publish("seen-message", messageId);
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  },
  { adminOnly: true }
);
