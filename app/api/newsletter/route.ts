import { withAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { slugify } from "@/utils";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const database: string | undefined = process.env.DATABASE;

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const route = searchParams.get("route");
  const sort = searchParams.get("sort") || "createdAt";
  const order = parseInt(searchParams.get("order") || "1"); // 1 for ascending, -1 for descending
  const limit = parseInt(searchParams.get("limit") || "0");
  const query: any = {};
  if (id) {
    query._id = new ObjectId(id);
  }
  if (route) {
    query.route = route;
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("newsletter");

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
});

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const client = await clientPromise;
      const collection = client.db(database).collection("newsletter");

      const formData = await req.formData();
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const publishedAt = formData.get("publishedAt") as string;
      const files = formData.getAll("files") as File[];

      // Upload files using Uploadthing
      let fileUrl = "";
      let fileId = "";
      if (files.length > 0) {
        const utapi = new UTApi();
        const uploadResponse = await utapi.uploadFiles(files);
        fileUrl = uploadResponse[0].data?.ufsUrl || "";
        fileId = uploadResponse[0].data?.key || "";
      }

      const newDocument = {
        title,
        description,
        route: slugify(title),
        publishedAt: new Date(publishedAt),
        fileUrl,
        fileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newDocument);
      return NextResponse.json(
        { success: true, id: result.insertedId },
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "An error occurred." },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);

export const PUT = withAuth(
  async (req: NextRequest) => {
    try {
      const client = await clientPromise;
      const collection = client.db(database).collection("newsletter");

      const formData = await req.formData();
      const id = formData.get("id") as string;
      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const publishedAt = formData.get("publishedAt") as string;
      const files = formData.getAll("files") as File[];
      const key = formData.get("key") as string;

      // Prepare update object
      const updateObject: any = {
        title,
        description,
        publishedAt: new Date(publishedAt),
        updatedAt: new Date(),
      };

      // Handle file uploads
      if (files.length > 0) {
        const utapi = new UTApi();
        const { success, deletedCount } = await utapi.deleteFiles(key);
        if (!success || deletedCount === 0) {
          return NextResponse.json(
            { error: "Failed to delete old file" },
            { status: 500 }
          );
        }
        const uploadResponse = await utapi.uploadFiles(files);
        updateObject.fileUrl = uploadResponse[0].data?.ufsUrl || "";
        updateObject.fileId = uploadResponse[0].data?.key || "";
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateObject }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: "No document found with the provided ID" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "An error occurred." },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);

export const DELETE = withAuth(
  async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    try {
      const client = await clientPromise;
      const collection = client.db(database).collection("newsletter");

      // Find the document to delete
      const document = await collection.findOne({ _id: new ObjectId(id) });
      if (!document) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }
      // Delete the file from Uploadthing if it exists
      const utapi = new UTApi();
      if (document.fileId) {
        const { success, deletedCount } = await utapi.deleteFiles(
          document.fileId
        );
        if (!success || deletedCount === 0) {
          return NextResponse.json(
            { error: "Failed to delete file from Uploadthing" },
            { status: 500 }
          );
        }
      }
      // Delete the document from MongoDB
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "An error occurred." },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);
