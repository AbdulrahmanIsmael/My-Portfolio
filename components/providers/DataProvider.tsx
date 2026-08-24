"use client";

import { createContext, useContext } from "react";

export interface ProjectItem {
  id: string | number;
  type?: "frontend" | "backend" | "fullstack" | "mobile";
  title?: string;
  description?: string;
  image?: string;
  tech: string[];
  category?: string;
  liveUrl?: string;
  githubUrl: string;
}

export interface SkillItem {
  name: string;
  icon: string;
  color?: string;
}

export interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  type: string;
  achievements?: string[];
  projects?: { id: string; name?: string; desc?: string }[];
}

export interface SocialsData {
  linkedin?: string;
  gmail?: string;
  github?: string;
  gitlab?: string;
  stackOverflow?: string;
  behance?: string;
  [key: string]: string | undefined;
}

export interface AppData {
  projects: ProjectItem[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  socials: SocialsData;
}

const DataContext = createContext<AppData | null>(null);

export function DataProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: AppData;
}) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useData(): AppData {
  const context = useContext(DataContext);
  if (!context) {
    return {
      projects: [],
      skills: [],
      experience: [],
      socials: {},
    };
  }
  return context;
}
