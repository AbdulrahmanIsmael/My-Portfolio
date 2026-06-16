import { cookies } from "next/headers";

export async function hashSessionToken(password: string, secret: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password + secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function isRequestAuthorized(): Promise<boolean> {
  const expectedPassword = process.env.DASHBOARD_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET || "default_session_secret_hash_salt";
  if (!expectedPassword) return false;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("portfolio_admin_session")?.value;
  const correctSessionToken = await hashSessionToken(expectedPassword, sessionSecret);

  return sessionCookie === correctSessionToken;
}
