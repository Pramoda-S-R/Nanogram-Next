import { withAdminAuth, withDevAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;

export const GET = withDevAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const completed = searchParams.get("completed");
  const sort = searchParams.get("sort") || "createdAt";
  const order = parseInt(searchParams.get("order") || "1"); // 1 for ascending, -1 for descending
  const limit = parseInt(searchParams.get("limit") || "0");
  const id = searchParams.get("id");
  const query: any = {};
  if (completed) {
    query.completed = completed === "true";
  }
  if (id) {
    query._id = new ObjectId(id);
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("events");

    let cursor = collection.find(query);
    if (sort) {
      cursor = cursor.sort({ [sort]: order } as Record<string, 1 | -1>);
    }
    if (limit > 0) {
      cursor = cursor.limit(limit);
    }

    const documents = await cursor.toArray();

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("events");

    const body = await req.json();
    if (!body.title || !body.date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      );
    }

    const result = await collection.insertOne(body);
    return NextResponse.json(
      { success: true, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
});

export const PUT = withAdminAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("events");

    const body = await req.json();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No documents matched the query" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { modifiedCount: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
});

export const DELETE = withAdminAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("events");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { deletedCount: result.deletedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
});
