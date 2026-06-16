import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isRequestAuthorized } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

const experienceFilePath = path.join(process.cwd(), "data", "experience.json");
const localeEnPath = path.join(process.cwd(), "locales", "en.json");
const localeArPath = path.join(process.cwd(), "locales", "ar.json");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExpEntry = Record<string, any>;

export async function GET() {
  try {
    const expContents = await fs.readFile(experienceFilePath, "utf8");
    const enContents = await fs.readFile(localeEnPath, "utf8");
    const arContents = await fs.readFile(localeArPath, "utf8");

    const experiences = JSON.parse(expContents) as ExpEntry[];
    const en = JSON.parse(enContents) as Record<string, Record<string, Record<string, ExpEntry>>>;
    const ar = JSON.parse(arContents) as Record<string, Record<string, Record<string, ExpEntry>>>;

    const merged = experiences.map((exp) => {
      const id = String(exp.id);
      const enExp = (en.Portfolio?.Experience?.[id] as ExpEntry) || {};
      const arExp = (ar.Portfolio?.Experience?.[id] as ExpEntry) || {};

      let achievements: string[] = [];
      let achievementsAr: string[] = [];

      if (Array.isArray(exp.achievements)) {
        achievements = (exp.achievements as string[]).map((ach: string) => String(enExp[ach] || ""));
        achievementsAr = (exp.achievements as string[]).map((ach: string) => String(arExp[ach] || ""));
      }

      let projects: { id: string; en: { name: string; desc: string }; ar: { name: string; desc: string } }[] = [];
      if (Array.isArray(exp.projects)) {
        projects = (exp.projects as { id: string }[]).map((proj) => {
          const enProj = (enExp[proj.id] as ExpEntry) || {};
          const arProj = (arExp[proj.id] as ExpEntry) || {};
          return {
            id: proj.id,
            en: { name: String(enProj.name || ""), desc: String(enProj.desc || "") },
            ar: { name: String(arProj.name || ""), desc: String(arProj.desc || "") },
          };
        });
      }

      return {
        id,
        type: exp.type,
        en: {
          title: String(enExp.title || ""),
          company: String(enExp.company || ""),
          location: String(enExp.location || ""),
          date: String(enExp.date || ""),
          description: String(enExp.description || ""),
          achievements,
        },
        ar: {
          title: String(arExp.title || ""),
          company: String(arExp.company || ""),
          location: String(arExp.location || ""),
          date: String(arExp.date || ""),
          description: String(arExp.description || ""),
          achievements: achievementsAr,
        },
        projects,
      };
    });

    return NextResponse.json(merged);
  } catch (error) {
    console.error("GET Experience API Error:", error);
    return NextResponse.json({ error: "Failed to read experience data." }, { status: 500 });
  }
}

interface ClientExp {
  id: string;
  type: string;
  en?: { title?: string; company?: string; location?: string; date?: string; description?: string; achievements?: string[] };
  ar?: { title?: string; company?: string; location?: string; date?: string; description?: string; achievements?: string[] };
  projects?: { id: string; en?: { name?: string; desc?: string }; ar?: { name?: string; desc?: string } }[];
}

export async function POST(request: Request) {
  try {
    if (!(await isRequestAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientExperiences = (await request.json()) as ClientExp[];

    const metadataList = clientExperiences.map((exp) => {
      const item: Record<string, unknown> = {
        id: String(exp.id),
        type: exp.type || "work",
      };

      if (exp.en?.achievements && exp.en.achievements.length > 0) {
        item.achievements = exp.en.achievements.map((_: string, idx: number) => `achievement${idx + 1}`);
      }

      if (exp.projects && exp.projects.length > 0) {
        item.projects = exp.projects.map((proj) => ({ id: proj.id }));
      }

      return item;
    });

    const enContents = await fs.readFile(localeEnPath, "utf8");
    const arContents = await fs.readFile(localeArPath, "utf8");

    const en = JSON.parse(enContents) as Record<string, Record<string, Record<string, ExpEntry>>>;
    const ar = JSON.parse(arContents) as Record<string, Record<string, Record<string, ExpEntry>>>;

    if (!en.Portfolio) en.Portfolio = {};
    if (!en.Portfolio.Experience) en.Portfolio.Experience = {};
    if (!ar.Portfolio) ar.Portfolio = {};
    if (!ar.Portfolio.Experience) ar.Portfolio.Experience = {};

    const clientIds = new Set(clientExperiences.map((p) => String(p.id)));
    for (const key of Object.keys(en.Portfolio.Experience)) {
      if (key !== "title" && key !== "subTitle" && !clientIds.has(key)) delete en.Portfolio.Experience[key];
    }
    for (const key of Object.keys(ar.Portfolio.Experience)) {
      if (key !== "title" && key !== "subTitle" && !clientIds.has(key)) delete ar.Portfolio.Experience[key];
    }

    clientExperiences.forEach((exp) => {
      const idStr = String(exp.id);

      const enExpObj: ExpEntry = {
        title: exp.en?.title || "",
        company: exp.en?.company || "",
        location: exp.en?.location || "",
        date: exp.en?.date || "",
        description: exp.en?.description || "",
      };

      const arExpObj: ExpEntry = {
        title: exp.ar?.title || "",
        company: exp.ar?.company || "",
        location: exp.ar?.location || "",
        date: exp.ar?.date || "",
        description: exp.ar?.description || "",
      };

      exp.en?.achievements?.forEach((ach: string, idx: number) => { enExpObj[`achievement${idx + 1}`] = ach || ""; });
      exp.ar?.achievements?.forEach((ach: string, idx: number) => { arExpObj[`achievement${idx + 1}`] = ach || ""; });

      exp.projects?.forEach((proj) => {
        enExpObj[proj.id] = { name: proj.en?.name || "", desc: proj.en?.desc || "" };
        arExpObj[proj.id] = { name: proj.ar?.name || "", desc: proj.ar?.desc || "" };
      });

      en.Portfolio.Experience[idStr] = enExpObj;
      ar.Portfolio.Experience[idStr] = arExpObj;
    });

    await fs.writeFile(experienceFilePath, JSON.stringify(metadataList, null, 2), "utf8");
    await fs.writeFile(localeEnPath, JSON.stringify(en, null, 2), "utf8");
    await fs.writeFile(localeArPath, JSON.stringify(ar, null, 2), "utf8");

    // Trigger static page rebuild
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Experience API Error:", error);
    return NextResponse.json({ error: "Failed to update experience data." }, { status: 500 });
  }
}
