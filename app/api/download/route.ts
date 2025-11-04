export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const filename = req.nextUrl.searchParams.get("filename");
  const filePath = path.join(process.cwd(), "public", "files", filename!);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}
