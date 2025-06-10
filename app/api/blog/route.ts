import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;
const apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(req: NextRequest) {
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKey && apiKeyHeader !== apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("events");

    const documents = await collection.find({}).toArray();
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
    const collection = client.db(database).collection("events");

    const body = await req.json();
    const result = await collection.insertOne(body);

    return NextResponse.json(
      { message: "Event created successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
}
