import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import Socials from "@/components/sections/Socials";
import { DataProvider } from "@/components/providers/DataProvider";
import { promises as fs } from "fs";
import path from "path";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const projects = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", "projects.json"), "utf8"));
  const skills = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", "skills.json"), "utf8"));
  const experience = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", "experience.json"), "utf8"));
  const socials = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", "socials.json"), "utf8"));
  
  const data = { projects, skills, experience, socials };

  return (
    <DataProvider data={data}>
      <Header />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
      <Socials />
    </DataProvider>
  );
}
