import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/apiauth";
import { User } from "@/types/mongodb";

const database = process.env.DATABASE;

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const dev = req.headers.get("x-dev-userid") as string;
    const tier = req.headers.get("x-dev-tier") as string;

    const formData = await req.formData();
    const userIdStr = formData.get("userId");
    const followUserIdStr = formData.get("followUserId");

    if (!userIdStr || !followUserIdStr) {
      return NextResponse.json(
        { error: "User ID and Follow User ID are required." },
        { status: 400 }
      );
    }

    // If tier is free, ensure the userId matches the developer's user ID
    if (tier === "free" && dev !== userIdStr) {
      return NextResponse.json(
        { error: "User ID does not match developer user ID." },
        { status: 400 }
      );
    }

    let userId: ObjectId;
    let followUserId: ObjectId;

    try {
      userId = new ObjectId(userIdStr as string);
      followUserId = new ObjectId(followUserIdStr as string);
    } catch {
      return NextResponse.json(
        { error: "Invalid ID format." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const collection = client.db(database).collection<User>("user");

    // Check if the user exists in the database
    const user = await collection.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Check if the follow user exists in the database
    const followUser = await collection.findOne({ _id: followUserId });
    if (!followUser) {
      return NextResponse.json(
        { error: "Follow User not found." },
        { status: 404 }
      );
    }

    // Toggle follow status
    const alreadyFollowing = user.following?.some((id: ObjectId) =>
      id.equals(followUserId)
    );

    if (alreadyFollowing) {
      await collection.updateOne(
        { _id: user._id },
        { $pull: { following: followUserId } }
      );
      await collection.updateOne(
        { _id: followUser._id },
        { $pull: { followers: user._id } }
      );
      return NextResponse.json(
        { success: true, action: "unfollow" },
        { status: 200 }
      );
    } else {
      await collection.updateOne(
        { _id: user._id },
        { $addToSet: { following: followUser._id } }
      );
      await collection.updateOne(
        { _id: followUser._id },
        { $addToSet: { followers: user._id } }
      );
      return NextResponse.json(
        { success: true, action: "follow" },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to connect to database", message: error.message },
      { status: 500 }
    );
  }
});
