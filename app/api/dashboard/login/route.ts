import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashSessionToken } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const expectedPassword = process.env.DASHBOARD_PASSWORD;
    const sessionSecret = process.env.SESSION_SECRET || "default_session_secret_hash_salt";

    if (!expectedPassword) {
      return NextResponse.json(
        { error: "Dashboard password is not configured on the server." },
        { status: 500 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    // Generate secure session token
    const token = await hashSessionToken(expectedPassword, sessionSecret);

    const cookieStore = await cookies();
    cookieStore.set("portfolio_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
