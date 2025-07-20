import { NextRequest, NextResponse } from "next/server";
import { ably } from "@/lib/ably";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Messager, SharedPost } from "@/types";
import { withAuth } from "@/lib/apiauth";

const database: string | undefined = process.env.DATABASE;

export const DELETE = withAuth(
  async (req: NextRequest) => {
    try {
      const searchParams = req.nextUrl.searchParams;
      const senderStrId = searchParams.get("senderId");
      const recipientStrId = searchParams.get("recipientId");
      const messageStrId = searchParams.get("messageId");
      if (!senderStrId || !recipientStrId || !messageStrId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      let senderId: ObjectId;
      let recipientId: ObjectId;
      let messageId: ObjectId;

      try {
        senderId = new ObjectId(senderStrId as string);
        recipientId = new ObjectId(recipientStrId as string);
        messageId = new ObjectId(messageStrId as string);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid ObjectId format" },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      await client.db(database).collection("messages").deleteOne({
        _id: messageId,
      });

      const channelName = `dm-${[senderId, recipientId].sort().join("-")}`;
      const channel = ably.channels.get(channelName);
      await channel.publish("delete-message", messageId);

      return NextResponse.json({ messageId }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);
