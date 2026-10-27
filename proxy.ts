import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Pages anyone can visit without being signed in
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  publicRoutes: ["/api/uploadthing"]

  const { userId, redirectToSignUp } = await auth();

  // Not signed in -> send them to the Sign Up page
  if (!userId) {
    return redirectToSignUp({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
