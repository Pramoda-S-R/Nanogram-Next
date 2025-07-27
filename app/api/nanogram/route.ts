import { withAuth } from "@/lib/apiauth";
import cloudinary from "@/lib/cloudinary";
import clientPromise from "@/lib/mongodb";
import { Nanogram } from "@/types";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const alumini = searchParams.get("alumini");
  const core = searchParams.get("core");
  const content = searchParams.get("content");
  const sort = searchParams.get("sort") || "createdAt";
  const order = parseInt(searchParams.get("order") || "1"); // 1 for ascending, -1 for descending
  const limit = parseInt(searchParams.get("limit") || "0");
  const id = searchParams.get("id");

  const query: any = {};
  if (alumini) {
    query.alumini = alumini === "true";
  }
  if (core) {
    query.core = core === "true";
  }
  if (content === "true") {
    query.content = { $exists: true, $ne: "" };
  }
  if (id) {
    query._id = new ObjectId(id);
  }

  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("nanogram");

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

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const formData = await req.formData();
      const name = formData.get("name")?.toString();
      const role = formData.get("role")?.toString();
      const content = formData.get("content")?.toString();
      const avatar = formData.get("avatar") as File;
      const linkedin = formData.get("linkedin")?.toString();
      const github = formData.get("github")?.toString();
      const instagram = formData.get("instagram")?.toString();
      const alumini = formData.get("alumini") === "true";
      const core = formData.get("core") === "true";
      const priority = parseInt(formData.get("priority")?.toString() || "0");

      if (!name || !role) {
        return NextResponse.json(
          { error: "Name and role are required" },
          { status: 400 }
        );
      }

      let avatarUrl: string | undefined;
      let avatarId: string | undefined;

      if (avatar && avatar instanceof File) {
        const imageBuffer = Buffer.from(await avatar.arrayBuffer());

        const uploadResult: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "nanogram/members" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(imageBuffer);
        });

        const rawUrl = uploadResult.secure_url;
        avatarUrl = rawUrl.replace("/upload/", "/upload/q_auto,f_auto/");
        avatarId = uploadResult.public_id;
      }

      const client = await clientPromise;
      const collection = client.db(database).collection("nanogram");

      const data: any = {
        name,
        role,
        content,
        avatarId,
        avatarUrl,
        linkedin,
        github,
        instagram,
        alumini,
        core,
        priority,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(data);

      return NextResponse.json(
        { success: true, id: result.insertedId },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
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
    try {
      const formData = await req.formData();
      const id = formData.get("id")?.toString();

      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }

      const client = await clientPromise;
      const nanogram = await client
        .db(database)
        .collection<Nanogram>("nanogram")
        .findOne({ _id: new ObjectId(id) });
      if (!nanogram) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }

      const name = formData.get("name")?.toString();
      const role = formData.get("role")?.toString();
      const content = formData.get("content")?.toString();
      const avatar = formData.get("avatar") as File;
      const linkedin = formData.get("linkedin")?.toString();
      const github = formData.get("github")?.toString();
      const instagram = formData.get("instagram")?.toString();
      const alumini = formData.get("alumini") === "true";
      const core = formData.get("core") === "true";
      const priority = parseInt(formData.get("priority")?.toString() || "0");

      const oldAvatarId = nanogram.avatarId;

      let avatarUrl = undefined;
      let avatarId = undefined;

      if (avatar && avatar instanceof File) {
        const avatarBuffer = Buffer.from(await avatar.arrayBuffer());

        // If an avatar is provided, delete the old avatar from Cloudinary
        if (oldAvatarId) {
          await cloudinary.uploader.destroy(oldAvatarId);
        }

        // Upload the avatar to Cloudinary
        const uploadResult: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "nanogram/members" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(avatarBuffer);
        });

        const rawUrl = uploadResult.secure_url;
        avatarUrl = rawUrl.replace("/upload/", "/upload/q_auto,f_auto/");
        avatarId = uploadResult.public_id;
      }

      const updateData: any = {
        name,
        role,
        content,
        linkedin,
        github,
        instagram,
        alumini,
        core,
        priority,
        updatedAt: new Date(),
      };

      if (avatar) {
        updateData.avatarId = avatarId;
        updateData.avatarUrl = avatarUrl;
      }

      const collection = client.db(database).collection("nanogram");

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
      const client = await clientPromise;
      const collection = client.db(database).collection("nanogram");

      // Find the document to delete
      const nanogram = await collection.findOne({ _id: new ObjectId(id) });
      if (!nanogram) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }

      // If the document has an avatar, delete it from Cloudinary
      if (nanogram.avatarId) {
        await cloudinary.uploader.destroy(nanogram.avatarId);
      }

      await collection.deleteOne({ _id: new ObjectId(id) });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      return NextResponse.json(
        { error: "Failed to connect to database" },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);
