import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { isRequestAuthorized } from "@/lib/auth-utils";
import path from "path";
import { revalidatePath } from "next/cache";

const projectsFilePath = path.join(process.cwd(), "data", "projects.json");
const localeEnPath = path.join(process.cwd(), "locales", "en.json");
const localeArPath = path.join(process.cwd(), "locales", "ar.json");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonObj = Record<string, any>;

interface ProjectMeta {
  id: string;
  type: string;
  image: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
}

interface ClientProject extends ProjectMeta {
  en?: { title?: string; description?: string; category?: string };
  ar?: { title?: string; description?: string; category?: string };
}

export async function GET() {
  try {
    const projectsContents = await fs.readFile(projectsFilePath, "utf8");
    const enContents = await fs.readFile(localeEnPath, "utf8");
    const arContents = await fs.readFile(localeArPath, "utf8");

    const projects = JSON.parse(projectsContents) as ProjectMeta[];
    const en = JSON.parse(enContents) as JsonObj;
    const ar = JSON.parse(arContents) as JsonObj;

    const mergedProjects = projects.map((p) => {
      const enProj: JsonObj = en.Portfolio?.Projects?.projects?.[p.id] || {};
      const arProj: JsonObj = ar.Portfolio?.Projects?.projects?.[p.id] || {};

      return {
        ...p,
        en: {
          title: (enProj.title as string) || "",
          description: (enProj.description as string) || "",
          category: (enProj.category as string) || "",
        },
        ar: {
          title: (arProj.title as string) || "",
          description: (arProj.description as string) || "",
          category: (arProj.category as string) || "",
        },
      };
    });

    return NextResponse.json(mergedProjects);
  } catch (error) {
    console.error("GET Projects API Error:", error);
    return NextResponse.json(
      { error: "Failed to read projects data." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isRequestAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientProjects = (await request.json()) as ClientProject[];

    const metadataList: ProjectMeta[] = clientProjects.map((p) => ({
      id: String(p.id),
      type: p.type || "frontend",
      image: p.image || "",
      tech: p.tech || [],
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
    }));

    const enContents = await fs.readFile(localeEnPath, "utf8");
    const arContents = await fs.readFile(localeArPath, "utf8");

    const en = JSON.parse(enContents) as JsonObj;
    const ar = JSON.parse(arContents) as JsonObj;

    if (!en.Portfolio) en.Portfolio = {};
    if (!en.Portfolio.Projects) en.Portfolio.Projects = {};
    if (!en.Portfolio.Projects.projects) en.Portfolio.Projects.projects = {};

    if (!ar.Portfolio) ar.Portfolio = {};
    if (!ar.Portfolio.Projects) ar.Portfolio.Projects = {};
    if (!ar.Portfolio.Projects.projects) ar.Portfolio.Projects.projects = {};

    const clientIds = new Set(clientProjects.map((p) => String(p.id)));

    for (const key of Object.keys(en.Portfolio.Projects.projects as JsonObj)) {
      if (!clientIds.has(key)) delete en.Portfolio.Projects.projects[key];
    }
    for (const key of Object.keys(ar.Portfolio.Projects.projects as JsonObj)) {
      if (!clientIds.has(key)) delete ar.Portfolio.Projects.projects[key];
    }

    clientProjects.forEach((p) => {
      const idStr = String(p.id);
      en.Portfolio.Projects.projects[idStr] = {
        title: p.en?.title || "",
        description: p.en?.description || "",
        category: p.en?.category || "",
      };
      ar.Portfolio.Projects.projects[idStr] = {
        title: p.ar?.title || "",
        description: p.ar?.description || "",
        category: p.ar?.category || "",
      };
    });

    await fs.writeFile(
      projectsFilePath,
      JSON.stringify(metadataList, null, 2),
      "utf8",
    );
    await fs.writeFile(localeEnPath, JSON.stringify(en, null, 2), "utf8");
    await fs.writeFile(localeArPath, JSON.stringify(ar, null, 2), "utf8");

    // Trigger static page rebuild
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Projects API Error:", error);
    return NextResponse.json(
      { error: "Failed to update projects data." },
      { status: 500 },
    );
  }
}
