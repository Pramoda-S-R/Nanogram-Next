import { withAuth } from "@/lib/apiauth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const database: string | undefined = process.env.DATABASE;

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const reportIds = searchParams.getAll("id");
      const media = searchParams.get("media");
      const sort = searchParams.get("sort") || "createdAt";
      const order = parseInt(searchParams.get("order") || "-1") || -1;
      const limit = parseInt(searchParams.get("limit") || "10");
      const query: any = {};
      if (reportIds.length > 0) {
        query._id = { $in: reportIds.map((id) => new ObjectId(id)) };
      }
      if (media) {
        query.reportedMedia = media.toLowerCase();
      }

      const client = await clientPromise;
      const reports = client.db(database).collection("reports");
      let cursor = reports.find(query);
      if (sort) {
        cursor = cursor.sort({ [sort]: order } as Record<string, 1 | -1>);
      }
      if (limit > 0) {
        cursor = cursor.limit(limit);
      }
      const allReports = await cursor.toArray();

      return NextResponse.json(allReports, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "An error occurred while fetching reports." },
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
      const reporterId = formData.get("reporter");
      const reportedUserId = formData.get("reportedUser");
      const reportedMedia = formData.get("reportedMedia") as string;
      const mediaIdstr = formData.get("mediaId");
      const reason = formData.get("reason");
      const details = formData.get("details") || "";
      const status = "pending";

      if (
        !reporterId ||
        !reportedUserId ||
        !reportedMedia ||
        !mediaIdstr ||
        !reason
      ) {
        return NextResponse.json(
          { error: "Missing required fields." },
          { status: 400 }
        );
      }

      let reporter: ObjectId;
      let reportedUser: ObjectId;
      let mediaId: ObjectId;

      try {
        reporter = new ObjectId(reporterId.toString());
        reportedUser = new ObjectId(reportedUserId.toString());
        mediaId = new ObjectId(mediaIdstr.toString());
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid ObjectId format." },
          { status: 400 }
        );
      }

      const report = {
        reporter,
        reportedUser,
        reportedMedia: reportedMedia.toLowerCase(),
        mediaId,
        reason,
        details,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const client = await clientPromise;
      const reports = client.db(database).collection("reports");
      const result = await reports.insertOne(report);

      if (!result.acknowledged) {
        return NextResponse.json(
          { error: "Failed to create report." },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          message: "Report created successfully.",
          reportId: result.insertedId,
        },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "An error occurred while processing your request." },
        { status: 500 }
      );
    }
  },
  {
    adminOnly: true,
  }
);

export const PUT = withAuth(
  async (req: NextRequest) => {
    try {
      const formData = await req.formData();
      const id = formData.get("id") as string;
      const status = formData.get("status") as string;

      if (!id || !status) {
        return NextResponse.json(
          { error: "ID and status are required." },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const reports = client.db(database).collection("reports");
      const result = await reports.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: "Report not found or no changes made." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Report updated successfully." },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          error: "An error occurred while updating the report.",
          message: (error as Error).message || "Unknown error",
        },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);

export const DELETE = withAuth(
  async (req: NextRequest) => {
    try {
      const formData = await req.formData();
      const id = formData.get("id") as string;

      if (!id) {
        return NextResponse.json({ error: "ID is required." }, { status: 400 });
      }

      const client = await clientPromise;
      const reports = client.db(database).collection("reports");
      const result = await reports.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: "Report not found." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Report deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "An error occurred while deleting the report." },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);
