import { withAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { User } from "@/types";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "createdAt";
    const order = parseInt(searchParams.get("order") || "1"); // 1 = asc, -1 = desc
    const limit = parseInt(searchParams.get("limit") || "0");
    const userId = searchParams.get("user_id");
    const username = searchParams.get("username");
    const name = searchParams.get("name");
    const ids = searchParams.getAll("id");

    const query: any = {};

    if (ids.length > 0) {
      query._id = {
        $in: ids
          .filter((id) => typeof id === "string")
          .map((id) => new ObjectId(id as string)),
      };
    }
    if (userId) {
      query.userId = userId;
    }
    if (username) {
      query.username = username;
    }
    if (name) {
      const nameRegex = new RegExp(name, "i"); // Case-insensitive search
      query.$or = [
        { firstName: nameRegex },
        { lastName: nameRegex },
        { username: nameRegex },
      ];
    }

    const client = await clientPromise;
    const collection = client.db(database).collection("user");

    let cursor = collection.find(query);
    if (sort) {
      cursor = cursor.sort({ [sort]: order } as Record<string, 1 | -1>);
    }
    if (limit > 0) {
      cursor = cursor.limit(limit);
    }
    const documents = await cursor.toArray();
    return NextResponse.json({ documents }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to connect to database", message: error.message },
      { status: 500 }
    );
  }
});

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const formData = await req.formData();
      const userId = formData.get("userId");
      const username = formData.get("username");
      const firstName = formData.get("firstName");
      const lastName = formData.get("lastName");
      const email = formData.get("email");
      const bio = formData.get("bio");
      const avatarUrl = formData.get("avatarUrl");

      const body: User = {
        _id: new ObjectId(),
        userId: userId ? (userId as string) : "",
        username: username ? (username as string) : "",
        firstName: firstName ? (firstName as string) : "",
        lastName: lastName ? (lastName as string) : "",
        email: email ? (email as string) : "",
        bio: bio ? (bio as string) : "",
        avatarUrl: avatarUrl ? (avatarUrl as string) : undefined,
        karma: 0,
        role: "user",
        posts: [],
        likedPosts: [],
        savedPosts: [],
        following: [],
        followers: [],
        comments: [],
        likedComments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const client = await clientPromise;
      const collection = client.db(database).collection("user");
      const result = await collection.insertOne(body);

      return NextResponse.json(
        { insertedId: result.insertedId },
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: "Failed to connect to database", message: error.message },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);

export const PUT = withAuth(
  async (req: NextRequest) => {
    try {
      const formData = await req.formData();
      const userId = formData.get("userId");
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      const updateFields: Partial<User> = {};
      for (const [key, value] of formData.entries()) {
        if (value && key !== "userId") {
          // Only assign string values to fields that are not explicitly undefined in User type
          if (
            typeof (updateFields as any)[key] !== "undefined" ||
            key !== "avatarUrl"
          ) {
            (updateFields as any)[key] = value;
          }
        }
      }
      updateFields.updatedAt = new Date();

      const client = await clientPromise;
      const collection = client.db(database).collection("user");
      const result = await collection.updateOne(
        { userId: userId as string },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(
        { message: "User updated successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: "Failed to connect to database", message: error.message },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);

export const DELETE = withAuth(
  async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("user_id");
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const collection = client.db(database).collection("user");
      const result = await collection.deleteOne({ userId: userId });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: "Failed to connect to database", message: error.message },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);
