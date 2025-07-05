import { NextRequest, NextResponse } from "next/server";
import { ably } from "@/lib/ably";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Messager, SharedPost } from "@/types";
import { withAuth } from "@/lib/apiauth";

const database: string | undefined = process.env.DATABASE;

export const POST = withAuth(
  async (req: NextRequest) => {
    const { sender, recipient, content } = await req.json();
    if (!sender || !recipient || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let senderId: ObjectId;
    let recipientId: ObjectId;

    try {
      senderId = new ObjectId(sender._id as string);
      recipientId = new ObjectId(recipient._id as string);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid ObjectId format" },
        { status: 400 }
      );
    }

    const senderObj: Messager = {
      _id: senderId,
      username: sender.username,
      fullName: sender.fullName,
      avatarUrl: sender.avatarUrl || "",
    };

    const recipientObj: Messager = {
      _id: recipientId,
      username: recipient.username as string,
      fullName: recipient.fullName as string,
      avatarUrl: recipient.avatarUrl || undefined,
    };

    const message = {
      sender: senderObj,
      receiver: recipientObj,
      message: content.message as string | SharedPost,
      reactions: [],
      seen: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const client = await clientPromise;
    const result = await client
      .db(database)
      .collection("messages")
      .insertOne(message);

    const messageSent = {
      _id: result.insertedId,
      ...message,
    };

    // Set 

    const channelName = `dm-${[senderId, recipientId].sort().join("-")}`;
    const channel = ably.channels.get(channelName);
    await channel.publish("new-message", messageSent);

    return NextResponse.json({ success: true });
  },
  { adminOnly: true }
);
