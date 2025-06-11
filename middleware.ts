import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/callback(.*)",
  "/api(.*)",
  "/",
  "/about-us",
  "/events",
  "/blog(.*)",
  "/newsletter",
  "/feedback",
  "/privacy-policy",
  "/terms-of-service",
  "/sitemap",
]);

const isPrivateRoute = createRouteMatcher(["/blog/write-blog"]);

// const isAdminApiRoute = createRouteMatcher([
//   "/api/nanogram(.*)",
//   "/api/events(.*)",
//   "/api/newsletter(.*)",
// ]);

export default clerkMiddleware(async (auth, req) => {
  if (isPrivateRoute(req) || !isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|otf|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
