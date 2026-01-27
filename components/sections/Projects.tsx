"use client";

import { FiExternalLink, FiGithub } from "react-icons/fi";

import { I_appStore } from "@/stores/types/appStore-types";
import Image from "next/image";
import Link from "next/link";
import Title from "@/components/ui/Title";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { useTranslations } from "next-intl";

const Projects = () => {
  const { arabicLang, lightMode } = useAppStore((state) => state as I_appStore);
  const projectMessages = useTranslations(
    `Portfolio.Projects.${arabicLang ? "ar" : "en"}`,
  );
  const projects = [
    {
      id: 1,
      title: projectMessages("projects.1.title"),
      description: projectMessages("projects.1.description"),
      image: projectMessages("projects.1.image"),
      tech: ["Angular", "TypeScript", "CSS"],
      category: projectMessages("projects.1.category"),
      liveUrl: "https://seafarers-management-system.vercel.app/",
      githubUrl:
        "https://github.com/AbdulrahmanIsmael/Seafarers-Management-System",
    },
    {
      id: 2,
      title: projectMessages("projects.2.title"),
      description: projectMessages("projects.2.description"),
      image: projectMessages("projects.2.image"),
      tech: ["TypeScript", "Tailwind CSS", "Webpack", "Firebase"],
      category: projectMessages("projects.2.category"),
      liveUrl: "https://i-quiz-quizzes-platform.vercel.app/",
      githubUrl: "https://github.com/AbdulrahmanIsmael/iQuiz-Quizzes-platform",
    },
    {
      id: 3,
      title: projectMessages("projects.3.title"),
      description: projectMessages("projects.3.description"),
      image: projectMessages("projects.3.image"),
      tech: ["React", "TypeScript", "Tailwind"],
      category: projectMessages("projects.3.category"),
      liveUrl: "https://cinemania-teal.vercel.app/",
      githubUrl: "https://github.com/AbdulrahmanIsmael/Cinemania_website",
    },
    {
      id: 4,
      title: projectMessages("projects.4.title"),
      description: projectMessages("projects.4.description"),
      image: projectMessages("projects.4.image"),
      tech: ["React", "Material UI", "CSS", "Firebase"],
      category: projectMessages("projects.4.category"),
      liveUrl: "https://teryaq-app.vercel.app/",
      githubUrl:
        "https://github.com/AbdulrahmanIsmael/TERYAQ_smart-medicine-reminder",
    },
    {
      id: 5,
      title: projectMessages("projects.5.title"),
      description: projectMessages("projects.5.description"),
      image: projectMessages("projects.5.image"),
      tech: ["Next.js", "CSS"],
      category: projectMessages("projects.5.category"),
      liveUrl: "https://events-app-cyan-alpha.vercel.app/",
      githubUrl: "https://github.com/AbdulrahmanIsmael/Events-Website",
    },
    {
      id: 6,
      title: projectMessages("projects.6.title"),
      description: projectMessages("projects.6.description"),
      image: projectMessages("projects.6.image"),
      tech: ["React", "Sass"],
      category: projectMessages("projects.6.category"),
      liveUrl: "https://todogo-gold.vercel.app/",
      githubUrl: "https://github.com/AbdulrahmanIsmael/Todo-List-APP_TodoGo",
    },
    {
      id: 7,
      title: projectMessages("projects.7.title"),
      description: projectMessages("projects.7.description"),
      image: projectMessages("projects.7.image"),
      tech: ["Next.js", "Tailwind CSS"],
      category: projectMessages("projects.7.category"),
      liveUrl: "https://tozan-landing-page.vercel.app/",
      githubUrl: "https://github.com/AbdulrahmanIsmael/tozan-landing-page",
    },
    {
      id: 8,
      title: projectMessages("projects.8.title"),
      description: projectMessages("projects.8.description"),
      image: projectMessages("projects.8.image"),
      tech: ["Pug", "Sass", "JS", "Gulp"],
      category: projectMessages("projects.8.category"),
      githubUrl:
        "https://github.com/AbdulrahmanIsmael/News-Website_Newslyverse",
    },
    {
      id: 9,
      title: projectMessages("projects.9.title"),
      description: projectMessages("projects.9.description"),
      image: projectMessages("projects.9.image"),
      tech: ["HTML5", "CSS3", "JS", "Gulp"],
      category: projectMessages("projects.9.category"),
      githubUrl: "https://github.com/AbdulrahmanIsmael/shippr-ecommerce",
    },
  ];

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
          {projects.map((project, index) => (
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
                ${
                  lightMode
                    ? "bg-primaryDark text-textDark"
                    : "bg-primaryLight text-textLight"
                }
                ${
                  lightMode
                    ? "shadow-xl shadow-subtleDark/20"
                    : "shadow-xl shadow-subtleLight/20"
                }
                border ${
                  lightMode ? "border-subtleDark/30" : "border-subtleLight/30"
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
                    className={`absolute top-4 ${
                      arabicLang ? "left-4" : "right-4"
                    } px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      lightMode
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
                    className={`text-2xl font-bold transition-colors ${
                      lightMode
                        ? "group-hover:text-accentDark"
                        : "group-hover:text-accentLight"
                    }`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      lightMode ? "text-textDark/70" : "text-textLight/70"
                    }`}
                  >
                    {project.description}
                  </p>
                  {/* Tech Stack Section */}
                  <div className="pt-3 border-t border-subtleLight/20">
                    <h4
                      className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                        lightMode ? "text-textDark/50" : "text-textLight/50"
                      }`}
                    >
                      {arabicLang ? "التقنيات المستخدمة" : "Tech Stack"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => {
                        //const techInfo = techIcons[tech];
                        return (
                          <div
                            key={tech}
                            className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                            transition-all duration-300 hover:scale-105
                            ${
                              lightMode
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
                  className={`absolute bottom-0 left-0 right-0 h-1 ${
                    lightMode
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
