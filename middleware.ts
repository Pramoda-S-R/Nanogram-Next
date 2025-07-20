import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don’t require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/callback(.*)",
  "/about-us",
  "/events",
  "/gallery",
  "/blog(.*)",
  "/embed(.*)",
  "/status(.*)",
  "/newsletter(.*)",
  "/feedback",
  "/privacy-policy",
  "/terms-of-service",
  "/sitemap",
]);

// Define any private routes you want explicitly protected
const isPrivateRoute = createRouteMatcher(["/blog/write-blog"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPrivateRoute(req) || !isPublicRoute(req)) {
    await auth.protect();
  }
});

// Only apply middleware to non-static, non-API routes
export const config = {
  matcher: [
    "/((?!api|_next|embed|status|.*\\..*).*)",
  ],
};
