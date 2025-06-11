import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const database: string | undefined = process.env.DATABASE;
const apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(req: NextRequest) {
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKey && apiKeyHeader !== apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("id");
  const sort = searchParams.get("sort") || "createdAt";
  const order = parseInt(searchParams.get("order") || "1"); // 1 for ascending, -1 for descending
  const limit = parseInt(searchParams.get("limit") || "0");
  const query: any = {};
  if (postId) {
    query._id = new ObjectId(postId);
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("posts");

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
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKey && apiKeyHeader !== apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("posts");

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const image = formData.get("image") as File;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "Title, content, and author are required." },
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
      title,
      content,
      author,
      imageId,
      imageUrl,
      createdAt: new Date(),
    };

    const response = await collection.insertOne(post);

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
}

export async function PUT(req: NextRequest) {
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKey && apiKeyHeader !== apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const oldImageUrl = formData.get("imageUrl") as string;
    const oldImageId = formData.get("imageId") as string;
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
      title,
      content,
      author,
      updatedAt: new Date(),
    };

    if (imageUrl) {
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
}

export async function DELETE(req: NextRequest) {
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKey && apiKeyHeader !== apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

    // Delete the post
    const response = await collection.deleteOne({ _id: new ObjectId(postId) });

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
}
