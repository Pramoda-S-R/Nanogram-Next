// import { withAuth } from "@/lib/apiauth";
// import { NextRequest, NextResponse } from "next/server";

// const database: string | undefined = process.env.DATABASE;

// export const GET = withAuth(async (req: NextRequest) => {
//   try {
//     const searchParams = req.nextUrl.searchParams;
//     const senderId = searchParams.get("senderId");
//     const conversationId = searchParams.get("id");
//     const receiverId = searchParams.get("receiverId");
//     const seen = searchParams.get("seen") === "true";
//     const sort = searchParams.get("sort") || "updatedAt";
//     const order = parseInt(searchParams.get("order") || "-1");
//     const limit = parseInt(searchParams.get("limit") || "20");
//     const skip = parseInt(searchParams.get("skip") || "0");
//     const query = {}
    
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// });
