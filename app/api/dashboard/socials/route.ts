import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isRequestAuthorized } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

const dataFilePath = path.join(process.cwd(), "data", "socials.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Socials API Error:", error);
    return NextResponse.json(
      { error: "Failed to read socials data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isRequestAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    // Trigger static page rebuild
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Socials API Error:", error);
    return NextResponse.json(
      { error: "Failed to update socials data." },
      { status: 500 }
    );
  }
}
