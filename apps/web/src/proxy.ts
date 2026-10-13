import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Optimistic auth proxy/middleware logic.
 *
 * Rules:
 * 1. Homepage ("/") is public.
 * 2. Login page ("/login") is accessible if NOT logged in. Redirects to "/feed" if logged in.
 * 3. All other routes require a valid session cookie.
 */
export const proxy = async (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/"];

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/resend-verification-email",
    "/login/magic",
  ];

  // 1. Homepage is always public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Login page check
  if (authRoutes.includes(pathname)) {
    // If user is already logged in, redirect them to the feed
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
    return NextResponse.next();
  }

  // 3. All other pages require authentication
  if (!sessionCookie) {
    // Redirect to login if unauthenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

/**
 * Next.js Middleware matcher configuration.
 * Excludes internal paths and API routes from auth checks.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
