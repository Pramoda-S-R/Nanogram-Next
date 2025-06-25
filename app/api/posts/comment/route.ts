import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/apiauth";
import { Comment, Post } from "@/types";

const database: string | undefined = process.env.DATABASE;

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const postIdStr = req.nextUrl.searchParams.get("postId");
    const ids = req.nextUrl.searchParams.getAll("id");
    const sort = req.nextUrl.searchParams.get("sort") || "createdAt";
    const order = parseInt(req.nextUrl.searchParams.get("order") || "1"); // 1 = asc, -1 = desc
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 0);
    const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0", 0);
    const query: any = {};
    if (ids.length > 0) {
      query._id = {
        $in: ids.map((id) => {
          return /^[a-f\d]{24}$/i.test(id) ? new ObjectId(id) : id; // fallback to string
        }),
      };
    }

    const client = await clientPromise;
    const db = client.db(database);

    if (postIdStr) {
      let postId: ObjectId;
      try {
        postId = new ObjectId(postIdStr);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid Post ID format." },
          { status: 400 }
        );
      }

      // Fetch the post
      const post = await db.collection<Post>("posts").findOne({ _id: postId });
      if (!post) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
      }

      query.postId = postId;
    }

    // Fetch comments for the post
    const collection = db.collection<Comment>("comments");
    const pipeline: any[] = [
      { $match: query },

      ...(sort === "likesCount"
        ? [
            {
              $addFields: {
                likesCount: { $size: { $ifNull: ["$likes", []] } }, // safely compute likes length
              },
            },
            { $sort: { likesCount: order } },
          ]
        : [{ $sort: { [sort]: order } }]),

      {
        $lookup: {
          from: "user",
          let: { commenterId: "$commenter" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$_id",
                    {
                      $cond: {
                        if: { $eq: [{ $type: "$$commenterId" }, "objectId"] },
                        then: "$$commenterId",
                        else: { $toObjectId: "$$commenterId" },
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: "commenter",
        },
      },
      {
        $unwind: {
          path: "$commenter",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (skip > 0) {
      pipeline.push({ $skip: skip });
    }
    if (limit > 0) {
      pipeline.push({ $limit: limit });
    }

    const cursor = collection.aggregate(pipeline);
    const comments = await cursor.toArray();

    return NextResponse.json({ documents: comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching comments." },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const dev = req.headers.get("x-dev-userid") as string;
    const tier = req.headers.get("x-dev-tier") as string;

    const formData = await req.formData();
    const postId_str = formData.get("postId") as string;
    const commenter_str = formData.get("commenter") as string;
    const content = formData.get("content") as string;
    if (!postId_str || !content || !commenter_str) {
      return NextResponse.json(
        { error: "Post ID, Commenter ID and content are required." },
        { status: 400 }
      );
    }
    if (tier === "free" && dev !== commenter_str) {
      return NextResponse.json(
        { error: "Commenter ID does not match developer user ID." },
        { status: 400 }
      );
    }

    let commenter: ObjectId;
    let postId: ObjectId;

    try {
      commenter = new ObjectId(commenter_str);
      postId = new ObjectId(postId_str);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid ID format." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(database);

    // Check if the post exists
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    // Create the comment
    const comment = {
      commenter,
      postId,
      content,
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(comment);

    // Update the post with the new comment
    await db
      .collection<Post>("posts")
      .updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: result.insertedId } }
      );

    return NextResponse.json(
      { message: "Comment added successfully.", commentId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the comment." },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const dev = req.headers.get("x-dev-userid") as string;
    const tier = req.headers.get("x-dev-tier") as string;
    const formData = await req.formData();
    const id = formData.get("id") as string | null;
    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required." },
        { status: 400 }
      );
    }

    let commentId: ObjectId;
    try {
      commentId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid Comment ID format." },
        { status: 400 }
      );
    }

    const content = formData.get("content") as string;
    if (!content) {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(database);

    // Check if the comment exists
    const comment = await db
      .collection<Comment>("comments")
      .findOne({ _id: commentId });
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    // Check if the commenter is the same as the developer user ID
    if (tier === "free" && dev !== comment.commenter.toString()) {
      return NextResponse.json(
        { error: "Commenter ID does not match developer user ID." },
        { status: 403 }
      );
    }

    // Update the comment
    await db
      .collection<Comment>("comments")
      .updateOne(
        { _id: commentId },
        { $set: { content, updatedAt: new Date() } }
      );

    return NextResponse.json(
      { message: "Comment updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the comment." },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const dev = req.headers.get("x-dev-userid") as string;
    const tier = req.headers.get("x-dev-tier") as string;
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required." },
        { status: 400 }
      );
    }

    let commentId: ObjectId;
    try {
      commentId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid Comment ID format." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(database);

    // Check if the comment exists
    const comment = await db
      .collection<Comment>("comments")
      .findOne({ _id: commentId });
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    // Check if the commenter is the same as the developer user ID
    if (tier === "free" && dev !== comment.commenter.toString()) {
      return NextResponse.json(
        { error: "Commenter ID does not match developer user ID." },
        { status: 403 }
      );
    }

    // Delete the comment
    await db.collection<Comment>("comments").deleteOne({ _id: commentId });

    // Remove the comment from the post
    await db
      .collection<Post>("posts")
      .updateOne({ comments: commentId }, { $pull: { comments: commentId } });

    return NextResponse.json(
      { message: "Comment deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the comment." },
      { status: 500 }
    );
  }
});
