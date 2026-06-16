import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isRequestAuthorized } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    if (!(await isRequestAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get("projectImage") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file found in the request." },
        { status: 400 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // We'll save project thumbnails to public/assets/images
    const imgDir = path.join(process.cwd(), "public", "assets", "images");
    await fs.mkdir(imgDir, { recursive: true });
    
    // Sanitize filename to avoid weird spaces or characters in the URL
    const originalName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueFileName = `${Date.now()}-${originalName}`;
    const imgPath = path.join(imgDir, uniqueFileName);
    
    await fs.writeFile(imgPath, buffer);
    
    // Path to be used by the frontend
    const publicPath = `/assets/images/${uniqueFileName}`;
    
    return NextResponse.json({ success: true, path: publicPath });
  } catch (error) {
    console.error("Upload Project Image API Error:", error);
    return NextResponse.json(
      { error: "Failed to upload project image." },
      { status: 500 }
    );
  }
}
