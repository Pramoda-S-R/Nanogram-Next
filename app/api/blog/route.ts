import { deleteBlogVectors, onBlog } from "@/bot/vectorSearch";
import { withAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { BlogPost } from "@/types/mongodb";
import { slugify } from "@/utils";
import { Filter, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const database: string | undefined = process.env.DATABASE;

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get("id");
  const route = searchParams.get("route");
  const sort = searchParams.get("sort") || "publishedAt";
  const order = parseInt(searchParams.get("order") || "1"); // 1 for ascending, -1 for descending
  const limit = parseInt(searchParams.get("limit") || "0");
  const query: Filter<BlogPost> = {};
  if (blogId) {
    query._id = new ObjectId(blogId);
  }
  if (route) {
    query.route = route;
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection<BlogPost>("blogs");

    let cursor = collection.find(query);
    if (sort) {
      cursor = cursor.sort({ [sort]: order } as Record<string, 1 | -1>);
    }
    if (limit > 0) {
      cursor = cursor.limit(limit);
    }

    const documents = await cursor.toArray();
    return NextResponse.json({ documents }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "An error occurred." },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const publishedAt = formData.get("publishedAt") as string;
    const authors = formData.get("authors") as string;
    const tags = formData.get("tags") as string;
    const cover = formData.get("cover") || undefined;
    const file = formData.get("file") as File;

    const client = await clientPromise;
    const collection = client.db(database).collection("blogs");

    const utapi = new UTApi();

    const response = await utapi.uploadFiles([file]);

    const body = {
      title,
      desc,
      cover,
      publishedAt: new Date(publishedAt),
      tags: JSON.parse(tags),
      authors: JSON.parse(authors),
      route: slugify(title),
      fileUrl: response[0].data?.ufsUrl,
      fileId: response[0].data?.key,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(body);

    onBlog({
      _id: result.insertedId.toString(),
      title,
      desc,
      cover,
      route: body.route,
      fileUrl: response[0].data?.ufsUrl,
    }).catch((error) => {
      console.error("Error processing blog for vector search:", error);
    });

    return NextResponse.json(
      { message: "Blog created successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error creating blog:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred." },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("blogs");

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const cover = formData.get("cover") as string || undefined;
    const publishedAt = formData.get("publishedAt") as string;
    const tags = formData.get("tags") as string;
    const authors = formData.get("authors") as string;
    const file = formData.get("file") as File;
    const key = formData.get("key") as string;

    const update: Partial<BlogPost> = {
      title,
      desc,
      cover: cover ?? undefined,
      publishedAt: new Date(publishedAt),
      tags: JSON.parse(tags),
      authors: JSON.parse(authors),
      route: title ? slugify(title) : undefined,
      updatedAt: new Date(),
    };

    if (file) {
      const utapi = new UTApi();
      await utapi.deleteFiles(key);
      const response = await utapi.uploadFiles([file]);
      update.fileUrl = response[0].data?.ufsUrl;
      update.fileId = response[0].data?.key;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No document found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog updated successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error updating blog:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred." },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("blogs");

    const blog = await collection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Delete vector search data
    await deleteBlogVectors(blog._id.toString()).catch((error) => {
      console.error("Error deleting blog vectors:", error);
    });

    // Delete the file from UploadThing
    const utapi = new UTApi();
    await utapi.deleteFiles(blog.fileId);

    // Delete the blog document from MongoDB
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error deleting blog:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred." },
      { status: 500 }
    );
  }
});
