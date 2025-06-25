import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/apiauth";
import { Comment, Post, User } from "@/types";

const database: string | undefined = process.env.DATABASE;

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    // Get the dev details
    const dev = req.headers.get("x-dev-userid") as string;
    const tier = req.headers.get("x-dev-tier") as string;

    // Extract postId, commentId, and userId from the form data
    const formData = await req.formData();
    const postIdStr = formData.get("postId") as string;
    const commentIdStr = formData.get("commentId") as string;
    const userIdStr = formData.get("userId") as string;

    if (!postIdStr || !commentIdStr || !userIdStr) {
      return NextResponse.json(
        { error: "Post ID, User ID and Comment ID are required." },
        { status: 400 }
      );
    }

    let postId: ObjectId;
    let commentId: ObjectId;
    let userId: ObjectId;
    try {
      postId = new ObjectId(postIdStr);
      commentId = new ObjectId(commentIdStr);
      userId = new ObjectId(userIdStr);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid Post ID, User ID or Comment ID format." },
        { status: 400 }
      );
    }

    // Check if the dev is allowed to like comments
    if (tier === "free" && dev !== userIdStr) {
      return NextResponse.json(
        { error: "Commenter ID does not match developer user ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(database);

    const post = await db.collection<Post>("posts").findOne({ _id: postId });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    const comment = await db
      .collection<Comment>("comments")
      .findOne({ _id: commentId });
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }
    const user = await db.collection<User>("user").findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    // Check if the user has already liked the comment
    const alreadyLiked = comment.likes.some((id) => id.equals(userId));
    if (alreadyLiked) {
      // User has already liked the comment, so we remove the like
      await db
        .collection<Comment>("comments")
        .updateOne({ _id: commentId }, { $pull: { likes: userId } });
      await db
        .collection<User>("user")
        .updateOne({ _id: userId }, { $pull: { likedComments: commentId } });
      console.log("Comment unliked successfully.");
      return NextResponse.json(
        { message: "Comment unliked successfully." },
        { status: 200 }
      );
    } else {
      // User has not liked the comment, so we add the like
      await db
        .collection<Comment>("comments")
        .updateOne({ _id: commentId }, { $addToSet: { likes: userId } });
      await db
        .collection<User>("user")
        .updateOne(
          { _id: userId },
          { $addToSet: { likedComments: commentId } }
        );
      console.log("Comment liked successfully.");
      return NextResponse.json(
        { message: "Comment liked successfully." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error liking comment:", error);
    return NextResponse.json(
      { error: "An error occurred while liking the comment." },
      { status: 500 }
    );
  }
});
