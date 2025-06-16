import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { withAuth } from "@/lib/apiauth";
import { User } from "@/types";

const database: string | undefined = process.env.DATABASE;

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.getAll("id");
  const sort = searchParams.get("sort") || "createdAt";
  const order = parseInt(searchParams.get("order") || "1"); // 1 for ascending, -1 for descending
  const limit = parseInt(searchParams.get("limit") || "0");

  const query: any = {};
  if (postId.length > 0) {
    query._id = {
      $in: postId.map((id) => {
        return /^[a-f\d]{24}$/i.test(id) ? new ObjectId(id) : id; // fallback to string
      }),
    };
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("posts");

    const pipeline: any[] = [
      { $match: query },
      { $sort: { [sort]: order } },
      {
        $lookup: {
          from: "user",
          let: { creatorId: "$creator" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$_id",
                    {
                      $cond: {
                        if: { $eq: [{ $type: "$$creatorId" }, "objectId"] },
                        then: "$$creatorId",
                        else: { $toObjectId: "$$creatorId" },
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true, // Keep posts without a creator
        },
      },
    ];

    if (limit > 0) {
      pipeline.push({ $limit: limit });
    }

    const cursor = collection.aggregate(pipeline);
    const posts = await cursor.toArray();

    return NextResponse.json({ documents: posts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const dev = req.headers.get("x-dev-userid") as string;
    const tier = req.headers.get("x-dev-tier") as string;
    const source = req.headers.get("x-dev-appname") as string;

    const formData = await req.formData();
    const creator = formData.get("creator") as string;
    if (tier === "free" && creator !== dev) {
      return NextResponse.json(
        { error: "Creator ID does not match developer user ID." },
        { status: 400 }
      );
    }
    const caption = formData.get("caption") as string;
    const image = formData.get("image") as File;
    const tags = formData.getAll("tags") as string[];

    if (!caption || !creator) {
      return NextResponse.json(
        { error: "Caption and Creator Id is required" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    let imageId = null;

    if (image && image instanceof File) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());

      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "nanogram/posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(imageBuffer);
      });

      const rawUrl = uploadResult.secure_url;
      imageUrl = rawUrl.replace("/upload/", "/upload/q_auto,f_auto/");
      imageId = uploadResult.public_id;
    }

    const post = {
      creator,
      caption,
      tags,
      imageId,
      imageUrl,
      source,
      savedBy: [],
      likes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const client = await clientPromise;
    const collection = client.db(database).collection("posts");
    const response = await collection.insertOne(post);

    // Update the creator's posts array
    const userCollection = client.db(database).collection("user");
    await userCollection.updateOne(
      { _id: new ObjectId(creator) },
      { $addToSet: { posts: response.insertedId } }
    );

    if (!userCollection) {
      return NextResponse.json(
        { error: "Failed to update user posts." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Post created successfully.",
        postId: response.insertedId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const dev = req.headers.get("x-dev-userid") as string;
    const tier = req.headers.get("x-dev-tier") as string;
    const source = req.headers.get("x-dev-appname") as string;

    const client = await clientPromise;
    const collection = client.db(database).collection("posts");

    const formData = await req.formData();
    const postId = formData.get("id") as string;
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }
    const post = await collection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    // Ensure the developer is authorized to update this post
    if (tier === "free" && post.creator !== dev) {
      return NextResponse.json(
        { error: "You are not authorized to update this post." },
        { status: 403 }
      );
    }
    const oldImageId = post.imageId; // Store the old image ID for deletion if a new image is uploaded

    const caption = formData.get("caption") as string;
    const tags = formData.getAll("tags") as string[];
    const image = formData.get("image") as File;

    let imageUrl = null;
    let imageId = null;

    if (image && image instanceof File) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());

      // If an image is provided, delete the old image from Cloudinary
      if (oldImageId) {
        await cloudinary.uploader.destroy(oldImageId);
      }

      // Upload the image to Cloudinary
      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "nanogram/posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(imageBuffer);
      });

      const rawUrl = uploadResult.secure_url;
      imageUrl = rawUrl.replace("/upload/", "/upload/q_auto,f_auto/");
      imageId = uploadResult.public_id;
    }

    const update: any = {
      caption,
      tags,
      source,
      updatedAt: new Date(),
    };

    if (image) {
      update.imageUrl = imageUrl;
      update.imageId = imageId;
    }

    const response = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: update }
    );

    if (response.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Post not found or no changes made." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Post updated successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req: NextRequest) => {
  const dev = req.headers.get("x-dev-userid") as string;
  const tier = req.headers.get("x-dev-tier") as string;

  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("id");
  if (!postId) {
    return NextResponse.json(
      { error: "Post ID is required." },
      { status: 400 }
    );
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("posts");

    // Find the post to get the imageId
    const post = await collection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    // Ensure the developer is authorized to delete this post
    if (tier === "free" && post.creator !== dev) {
      return NextResponse.json(
        { error: "You are not authorized to delete this post." },
        { status: 403 }
      );
    }
    // Delete the post
    const response = await collection.deleteOne({ _id: new ObjectId(postId) });

    // Remove the post from the creator's posts array
    const userCollection = client.db(database).collection<User>("user");
    await userCollection.updateOne(
      { _id: post.creator },
      {
        $pull: { posts: new ObjectId(postId) },
      }
    );

    // If an imageId exists, delete the image from Cloudinary
    if (post.imageId) {
      await cloudinary.uploader.destroy(post.imageId);
    }

    if (response.deletedCount === 0) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
});
