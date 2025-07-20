import { withAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const client = await clientPromise;
      const collection = client.db(database).collection("user");
      const anonymousUser = await collection.insertOne({
        userId: "anonymus_user_id",
        username: "anonymus",
        firstName: "Anonymus",
        lastName: "User",
        fullName: "Anonymus User",
        email: "anonymus@nanogram.club",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return NextResponse.json(
        { insertedId: anonymousUser.insertedId },
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: "Failed to connect to database", message: error.message },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);
