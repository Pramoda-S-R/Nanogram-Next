import { withAdminAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;

function generateApiKey() {
  return randomBytes(32).toString("hex");
}

export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const userId = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const tier = formData.get("tier") as string;
    const client = await clientPromise;
    const collection = client.db(database).collection("developers");

    const body = {
      userId,
      name,
      email,
      tier,
      apiKey: generateApiKey(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(body);

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: "Failed to create document" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Developer created successfully",
        id: result.insertedId,
        apiKey: body.apiKey,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error connecting to Server:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
});

export const PUT = withAdminAuth(async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "ID is required for update" },
      { status: 400 }
    );
  }
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const tier = formData.get("tier") as string;

    const client = await clientPromise;
    const collection = client.db(database).collection("developers");

    const body = {
      name,
      email,
      tier,
      updatedAt: new Date(),
    };

    if (id) {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: body }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: "Failed to update document" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Developer updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error connecting to Server:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
});

export const DELETE = withAdminAuth(async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "ID is required for deletion" },
      { status: 400 }
    );
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("developers");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Developer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error connecting to Server:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
});
