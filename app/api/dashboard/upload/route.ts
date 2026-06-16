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
    const cvFile = formData.get("cv") as File | null;
    const avatarFile = formData.get("avatar") as File | null;

    if (!cvFile && !avatarFile) {
      return NextResponse.json(
        { error: "No files found in the request upload fields ('cv' or 'avatar')." },
        { status: 400 }
      );
    }

    if (cvFile) {
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const cvDir = path.join(process.cwd(), "public", "files");
      await fs.mkdir(cvDir, { recursive: true });
      const cvPath = path.join(cvDir, "Abdulrahman Ismael CV.pdf");
      await fs.writeFile(cvPath, buffer);
      console.log("Uploaded CV replacement to:", cvPath);
    }

    if (avatarFile) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imgDir = path.join(process.cwd(), "public", "assets", "images");
      await fs.mkdir(imgDir, { recursive: true });
      const imgPath = path.join(imgDir, "personal-image-cutout.png");
      await fs.writeFile(imgPath, buffer);
      console.log("Uploaded Avatar replacement to:", imgPath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
