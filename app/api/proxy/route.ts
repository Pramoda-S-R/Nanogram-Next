import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_KEY = process.env.ADMIN_KEY || "default-api-key";

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const method = searchParams.get("method");
  let endpointWithQuery = "";
  switch (method) {
    // /api/nanogram endpoints
    case "getHeroNanograms": {
      endpointWithQuery =
        "/api/nanogram?core=true&sort=priority&order=1&limit=9";
      break;
    }
    case "getTestimonials": {
      endpointWithQuery =
        "/api/nanogram?alumini=true&content=true&sort=priority&order=1";
      break;
    }
    case "getCoreMembers": {
      endpointWithQuery = "/api/nanogram?core=true&sort=priority&order=1";
      break;
    }
    case "getAlumniMembers": {
      endpointWithQuery = "/api/nanogram?alumini=true&sort=priority&order=1";
      break;
    }
    // /api/events endpoints
    case "getEvents": {
      endpointWithQuery = "/api/events?completed=true&sort=date&order=-1";
      break;
    }
    case "getUpcomingEvents": {
      endpointWithQuery = "/api/events?completed=false&sort=date&order=1";
      break;
    }
    case "getRecentEvent": {
      endpointWithQuery =
        "/api/events?completed=true&sort=date&order=-1&limit=1";
      break;
    }
    case "getNextEvent": {
      endpointWithQuery =
        "/api/events?completed=false&sort=date&order=1&limit=1";
      break;
    }
    // /api/blog endpoints
    case "getAllBlogPosts": {
      endpointWithQuery = "/api/blog";
      break;
    }
    case "getBlogPostsById": {
      const id = searchParams.get("id");
      endpointWithQuery = `/api/blog?route=${id}`;
    }
    // /api/newsletter endpoints
    case "getAllNewsletters": {
      endpointWithQuery = "/api/newsletter";
      break;
    }
    // /api/status endpoint
    default: {
      endpointWithQuery = "/api/status";
      break;
    }
  }
  try {
    const response = await fetch(`${BASE_URL}${endpointWithQuery}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    });
    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const method = searchParams.get("method");
  let endpointWithQuery = "";
  const formData = await req.formData();
  switch (method) {
    case "createBlogPost": {
      endpointWithQuery = "/api/blog";
      break;
    }
    default: {
      endpointWithQuery = "/api/status";
      break;
    }
  }
  try {
    const response = await fetch(`${BASE_URL}${endpointWithQuery}`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
      },
      body: formData,
    });
    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
};
