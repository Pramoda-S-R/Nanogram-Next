import { withAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;

function generateApiKey() {
  return randomBytes(32).toString("hex");
}

export const GET = withAuth(
  async (req: NextRequest, dev: any) => {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") as string;
    const clerkid = searchParams.get("clerkid") as string;
    try {
      const client = await clientPromise;
      const collection = client.db(database).collection("developers");

      let userId: ObjectId;

      // If clerkid is provided, fetch by clerkid
      if (clerkid) {
        const userCollection = client.db(database).collection("user");
        const user = await userCollection.findOne({ userId: clerkid });
        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        userId = new ObjectId(user._id);
      }

      // Fetch all developers
      const developers = await collection.findOne({ userId: new ObjectId(id) });

      return NextResponse.json(developers, { status: 200 });
    } catch (error) {
      console.error("Error connecting to Server:", error);
      return NextResponse.json(
        { error: "Failed to connect to database" },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const formData = await req.formData();
      const userId = formData.get("id") as string;
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const appName = formData.get("appName") as string;
      const tier = "free";
      const client = await clientPromise;
      const collection = client.db(database).collection("developers");

      const body = {
        userId,
        name,
        email,
        tier,
        appName,
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

      // Change the role
      const userCollection = client.db(database).collection("user");
      const updateResult = await userCollection.updateOne(
        { username: userId },
        {
          $set: { role: "dev" },
        }
      );

      if (updateResult.modifiedCount === 0) {
        return NextResponse.json(
          { error: "Failed to update user role" },
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
  },
  { adminOnly: true }
);

export const PUT = withAuth(
  async (req: NextRequest) => {
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
  },
  { adminOnly: true }
);

export const DELETE = withAuth(
  async (req: NextRequest) => {
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
  },
  { adminOnly: true }
);
