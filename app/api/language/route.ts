import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { locale } = await request.json();
  const store = await cookies();

  store.set("locale", locale);
  return NextResponse.json({ success: true });
}
