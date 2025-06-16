import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/apiauth";
import path from "path";

const database: string | undefined = process.env.DATABASE;

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.getAll("id");
  const sort = searchParams.get("sort") || "createdAt";
  const order = parseInt(searchParams.get("order") || "1"); // 1 for ascending, -1 for descending
  const limit = parseInt(searchParams.get("limit") || "0");

  const query: any = {};
  if (postId.length > 0) {
    query._id = {
      $in: postId.map((id) => {
        return /^[a-f\d]{24}$/i.test(id) ? new ObjectId(id) : id; // fallback to string
      }),
    };
  }
  try {
    const client = await clientPromise;
    const collection = client.db(database).collection("posts");

    const pipeline: any[] = [
      { $match: query },
      { $sort: { [sort]: order } },
      {
        $lookup: {
          from: "user",
          let: { creatorId: "$creator" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$_id",
                    {
                      $cond: {
                        if: { $eq: [{ $type: "$$creatorId" }, "objectId"] },
                        then: "$$creatorId",
                        else: { $toObjectId: "$$creatorId" },
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true, // Keep posts without a creator
        },
      },
    ];

    if (limit > 0) {
      pipeline.push({ $limit: limit });
    }

    const cursor = collection.aggregate(pipeline);
    const posts = await cursor.toArray();

    return NextResponse.json({ documents: posts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
});
