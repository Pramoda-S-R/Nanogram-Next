import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/apiauth";
import { Post, User } from "@/types";

const database = process.env.DATABASE;

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const dev = req.headers.get("x-dev-userid") as string;
    const tier = req.headers.get("x-dev-tier") as string;
    const formData = await req.formData();
    const postIdStr = formData.get("postId");
    const userIdStr = formData.get("userId");
    if (!postIdStr || !userIdStr) {
      return NextResponse.json(
        { error: "Post ID and User ID are required." },
        { status: 400 }
      );
    }
    if (tier === "free" && dev !== userIdStr) {
      return NextResponse.json(
        { error: "User ID does not match developer user ID." },
        { status: 400 }
      );
    }

    let postObjectId: ObjectId;
    let userId: ObjectId;

    try {
      postObjectId = new ObjectId(postIdStr as string);
      userId = new ObjectId(userIdStr as string);
    } catch {
      return NextResponse.json(
        { error: "Invalid ID format." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const collection = client.db(database).collection<Post>("posts");

    // Check if the post exists in the database
    const post = await collection.findOne({ _id: postObjectId });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    // Check if the user exists in the database
    const userCollection = client.db(database).collection<User>("user");
    const user = await userCollection.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const alreadySaved = post.savedBy.some((id) => id.equals(userId));

    if (alreadySaved) {
      await collection.updateOne(
        { _id: postObjectId },
        { $pull: { savedBy: userId } }
      );
      await userCollection.updateOne(
        { _id: userId },
        { $pull: { savedPosts: postObjectId } }
      );
      return NextResponse.json(
        { message: "Post unsaved successfully." },
        { status: 200 }
      );
    } else {
      await collection.updateOne(
        { _id: postObjectId },
        { $addToSet: { savedBy: userId } }
      );
      await userCollection.updateOne(
        { _id: userId },
        { $addToSet: { savedPosts: postObjectId } }
      );
      return NextResponse.json(
        { message: "Post saved successfully." },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
});
