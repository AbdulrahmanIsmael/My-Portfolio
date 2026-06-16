"use client";

import { FiExternalLink, FiGithub } from "react-icons/fi";

import { I_appStore } from "@/stores/types/appStore-types";
import Image from "next/image";
import Link from "next/link";
import Title from "@/components/ui/Title";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { useTranslations } from "next-intl";
import { useData } from "@/components/providers/DataProvider";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  category: string;
  liveUrl?: string;
  githubUrl: string;
}

const Projects = () => {
  const { arabicLang, lightMode } = useAppStore((state) => state as I_appStore);
  const projectMessages = useTranslations("Portfolio.Projects");
  const { projects: projectsData } = useData();

  const projects: Project[] = (projectsData || []).map((project: any) => ({
    id: Number(project.id),
    title: projectMessages(`projects.${project.id}.title`),
    description: projectMessages(`projects.${project.id}.description`),
    image: project.image,
    tech: project.tech,
    category: projectMessages(`projects.${project.id}.category`),
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
  }));

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto flex flex-col gap-5">
        <Title
          subtitle={projectMessages("subTitle")}
          align={arabicLang ? "right" : "left"}
        >
          {projectMessages("title")}
        </Title>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              {/* Card */}
              <div
                className={`
                relative overflow-hidden rounded-2xl h-[550px]
                ${lightMode
                    ? "bg-primaryDark text-textDark"
                    : "bg-primaryLight text-textLight"
                  }
                ${lightMode
                    ? "shadow-xl shadow-subtleDark/20"
                    : "shadow-xl shadow-subtleLight/20"
                  }
                border ${lightMode ? "border-subtleDark/30" : "border-subtleLight/30"
                  }
              `}
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        <FiExternalLink className="w-6 h-6 text-white" />
                      </Link>
                    )}
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <FiGithub className="w-6 h-6 text-white" />
                    </Link>
                  </div>

                  {/* Category Badge */}
                  <div
                    className={`absolute top-4 ${arabicLang ? "left-4" : "right-4"
                      } px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${lightMode
                        ? "bg-white/20 text-white"
                        : "bg-black/20 text-white"
                      }`}
                  >
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3
                    className={`text-2xl font-bold transition-colors ${lightMode
                      ? "group-hover:text-accentDark"
                      : "group-hover:text-accentLight"
                      }`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${lightMode ? "text-textDark/70" : "text-textLight/70"
                      }`}
                  >
                    {project.description}
                  </p>
                  {/* Tech Stack Section */}
                  <div className="pt-3 border-t border-subtleLight/20">
                    <h4
                      className={`text-xs font-semibold mb-2 uppercase tracking-wide ${lightMode ? "text-textDark/50" : "text-textLight/50"
                        }`}
                    >
                      {arabicLang ? "التقنيات المستخدمة" : "Tech Stack"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech: string) => {
                        //const techInfo = techIcons[tech];
                        return (
                          <div
                            key={tech}
                            className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                            transition-all duration-300 hover:scale-105
                            ${lightMode
                                ? "bg-primaryLight/10"
                                : "bg-primaryDark/10"
                              }
                          `}
                            title={tech}
                          >
                            {/*techInfo && (
                              <techInfo.icon
                                className="w-4 h-4"
                                style={{
                                  color: lightMode
                                    ? techInfo.color
                                    : techInfo.color,
                                }}
                              />
                            )*/}
                            <span>{tech}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom colored line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${lightMode
                    ? "bg-linear-to-r from-accentDark to-secondaryDark"
                    : "bg-linear-to-r from-accentLight to-secondaryLight"
                    } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
