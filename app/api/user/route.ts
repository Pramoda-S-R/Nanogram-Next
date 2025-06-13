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
