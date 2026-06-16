import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isRequestAuthorized } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

const localeEnPath = path.join(process.cwd(), "locales", "en.json");
const localeArPath = path.join(process.cwd(), "locales", "ar.json");

export async function GET() {
  try {
    const enContents = await fs.readFile(localeEnPath, "utf8");
    const arContents = await fs.readFile(localeArPath, "utf8");

    const en = JSON.parse(enContents);
    const ar = JSON.parse(arContents);

    const personalInfo = {
      en: {
        name: en.Home?.name || "",
        profession: en.Home?.profession || "",
        bio: en.Portfolio?.About?.desc || "",
        location: en.Portfolio?.About?.location || "",
        resumeMessage: en.Home?.resume || "",
      },
      ar: {
        name: ar.Home?.name || "",
        profession: ar.Home?.profession || "",
        bio: ar.Portfolio?.About?.desc || "",
        location: ar.Portfolio?.About?.location || "",
        resumeMessage: ar.Home?.resume || "",
      },
    };

    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error("GET Personal API Error:", error);
    return NextResponse.json(
      { error: "Failed to read personal data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isRequestAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { en: enInput, ar: arInput } = await request.json();

    const enContents = await fs.readFile(localeEnPath, "utf8");
    const arContents = await fs.readFile(localeArPath, "utf8");

    const en = JSON.parse(enContents);
    const ar = JSON.parse(arContents);

    // Update en
    if (!en.Home) en.Home = {};
    en.Home.name = enInput.name || "";
    en.Home.profession = enInput.profession || "";
    en.Home.resume = enInput.resumeMessage || "";

    if (!en.Portfolio) en.Portfolio = {};
    if (!en.Portfolio.About) en.Portfolio.About = {};
    en.Portfolio.About.profession = enInput.profession || "";
    en.Portfolio.About.desc = enInput.bio || "";
    en.Portfolio.About.location = enInput.location || "";

    if (!en.Portfolio.Showcase) en.Portfolio.Showcase = {};
    en.Portfolio.Showcase.title = `Welcome, I am ${enInput.name || ""}`;
    en.Portfolio.Showcase.small = enInput.profession || "";

    if (!en.Footer) en.Footer = {};
    en.Footer.name = enInput.name || "";

    // Update ar
    if (!ar.Home) ar.Home = {};
    ar.Home.name = arInput.name || "";
    ar.Home.profession = arInput.profession || "";
    ar.Home.resume = arInput.resumeMessage || "";

    if (!ar.Portfolio) ar.Portfolio = {};
    if (!ar.Portfolio.About) ar.Portfolio.About = {};
    ar.Portfolio.About.profession = arInput.profession || "";
    ar.Portfolio.About.desc = arInput.bio || "";
    ar.Portfolio.About.location = arInput.location || "";

    if (!ar.Portfolio.Showcase) ar.Portfolio.Showcase = {};
    ar.Portfolio.Showcase.title = `السلام عليكم، إسمي ${arInput.name || ""}`;
    ar.Portfolio.Showcase.small = arInput.profession || "";

    if (!ar.Footer) ar.Footer = {};
    ar.Footer.name = arInput.name || "";

    // Save
    await fs.writeFile(localeEnPath, JSON.stringify(en, null, 2), "utf8");
    await fs.writeFile(localeArPath, JSON.stringify(ar, null, 2), "utf8");

    // Trigger static page rebuild
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Personal API Error:", error);
    return NextResponse.json(
      { error: "Failed to update personal data." },
      { status: 500 }
    );
  }
}
