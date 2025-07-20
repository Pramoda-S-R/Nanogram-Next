import { NextRequest, NextResponse } from "next/server";
import { ably } from "@/lib/ably";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Message, Messager, SharedPost } from "@/types";
import { withAuth } from "@/lib/apiauth";

const database: string | undefined = process.env.DATABASE;

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
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

      return NextResponse.json({ messageSent }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);

export const PUT = withAuth(
  async (req: NextRequest) => {
    try {
      const { messageId, emoji, userId } = await req.json();
      if (!messageId || !emoji || !userId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      let messageObjectId: ObjectId;
      let userObjectId: ObjectId;
      try {
        messageObjectId = new ObjectId(messageId as string);
        userObjectId = new ObjectId(userId as string);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid ObjectId format" },
          { status: 400 }
        );
      }
      const client = await clientPromise;
      const message = await client
        .db(database)
        .collection<Message>("messages")
        .findOne({ _id: messageObjectId });
      if (!message) {
        return NextResponse.json(
          { error: "Message not found" },
          { status: 404 }
        );
      }
      const reaction = {
        emoji,
        userId: userObjectId,
      };
      // if the message already has reactions from a user, we will update it
      const existingReactionIndex = message.reactions?.findIndex(
        (r: { emoji: string; userId: ObjectId }) =>
          r.userId.toString() === userObjectId.toString()
      );
      if (existingReactionIndex !== undefined && existingReactionIndex !== -1) {
        if (message.reactions) {
          message.reactions[existingReactionIndex] = reaction;
        }
      } else {
        message.reactions = [...(message.reactions || []), reaction];
      }

      const updatedMessage = {
        ...message,
        reactions: message.reactions,
        updatedAt: new Date(),
      };
      await client
        .db(database)
        .collection("messages")
        .updateOne({ _id: messageObjectId }, { $set: updatedMessage });

      const channelName = `dm-${[message.sender._id, message.receiver._id]
        .sort()
        .join("-")}`;
      const channel = ably.channels.get(channelName);
      await channel.publish("update-message", updatedMessage);

      return NextResponse.json({ updatedMessage }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);
