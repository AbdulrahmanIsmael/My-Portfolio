import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hashSessionToken } from "@/lib/auth-utils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gated dashboard paths
  const isDashboardPath = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/dashboard/login";

  if (isDashboardPath) {
    const expectedPassword = process.env.DASHBOARD_PASSWORD;
    const sessionSecret = process.env.SESSION_SECRET || "default_session_secret_hash_salt";

    if (!expectedPassword) {
      // If not configured, block access to prevent accidental exposure
      return new NextResponse(
        "Dashboard password configuration is missing on the server. Please check your .env settings.",
        { status: 500 }
      );
    }

    const sessionCookie = request.cookies.get("portfolio_admin_session")?.value;
    const correctSessionToken = await hashSessionToken(expectedPassword, sessionSecret);

    const isAuthenticated = sessionCookie === correctSessionToken;

    if (isLoginPage) {
      // If already authenticated, redirect to /dashboard
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  return NextResponse.next();
}

// Run middleware on dashboard paths and API routes that shouldn't run when unauthenticated (though API routes will also have their own checks where applicable)
export const config = {
  matcher: ["/dashboard/:path*"],
};
