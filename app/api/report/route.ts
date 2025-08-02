import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import { withAuth } from "@/lib/apiauth";

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.NANOGRAM_BASE_ID as string;

const base = new Airtable({ apiKey: apiKey }).base(baseId);
const tableName = "Reports";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const record = await base(tableName).find(id);
      return NextResponse.json(record);
    }

    const records = await base(tableName)
      .select({ pageSize: 10, sort: [{ field: "createdAt", direction: "desc" }] })
      .all();

    const formatted = records.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}, { adminOnly: true });

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

      const created = await base("Reports").create([
        {
          fields: {
            ReporterId: reporterId as string,
            ReportedUserId: reportedUserId as string,
            ReportedMedia: reportedMedia as string,
            MediaId: mediaIdstr as string,
            Reason: reason as string,
            Details: details as string,
            Status: status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      ]);

      return NextResponse.json({ success: true, data: created });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  },
  { adminOnly: true }
);


export const PUT = withAuth(async (req: NextRequest) => {
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

    const updated = await base(tableName).update([
      {
        id,
        fields: {
          Status: status,
        },
      },
    ]);

    return NextResponse.json({ message: "Report updated", data: updated });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}, { adminOnly: true });

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const deleted = await base(tableName).destroy([id]);

    return NextResponse.json({ message: "Report deleted", data: deleted });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}, { adminOnly: true });
