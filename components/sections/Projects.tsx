"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { I_appStore } from "@/stores/types/appStore-types";
import Image from "next/image";
import Link from "next/link";
import Title from "@/components/ui/Title";
import useAppStore from "@/stores/store";
import { useData } from "@/components/providers/DataProvider";
import { useTranslations } from "next-intl";

interface Project {
  id: number;
  type: "frontend" | "backend" | "fullstack" | "mobile";
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

  const [activeTab, setActiveTab] = useState<"all" | "frontend" | "backend" | "fullstack" | "mobile">("all");

  const projects: Project[] = (projectsData || []).map((project: any) => ({
    id: Number(project.id),
    type: project.type || "frontend", // Fallback if data doesn't have it
    title: projectMessages(`projects.${project.id}.title`),
    description: projectMessages(`projects.${project.id}.description`),
    image: project.image,
    tech: project.tech,
    category: projectMessages(`projects.${project.id}.category`),
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
  }));

  const filteredProjects = activeTab === "all" 
    ? projects 
    : projects.filter(p => p.type === activeTab);

  const tabs = [
    { id: "all", label: arabicLang ? "الكل" : "All" },
    { id: "frontend", label: arabicLang ? "واجهة أمامية" : "Frontend" },
    { id: "backend", label: arabicLang ? "واجهة خلفية" : "Backend" },
    { id: "fullstack", label: arabicLang ? "تطبيقات متكاملة" : "Fullstack" },
    { id: "mobile", label: arabicLang ? "تطبيقات موبايل" : "Mobile" },
  ] as const;

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto flex flex-col gap-8 px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Title
            subtitle={projectMessages("subTitle")}
            align={arabicLang ? "right" : "left"}
          >
            {projectMessages("title")}
          </Title>

          {/* Filter Tabs */}
          <div className={`flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl border ${
            lightMode ? 'bg-primaryDark border-subtleDark/15' : 'bg-primaryLight/30 border-subtleLight/15'
          } shadow-sm w-fit ${arabicLang ? "mr-auto" : "ml-auto"}`}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-5 py-2 text-sm font-semibold rounded-xl transition-colors z-10 ${
                    isActive 
                      ? lightMode ? "text-white" : "text-textDark"
                      : lightMode ? "text-textDark hover:text-accentDark" : "text-textLight/70 hover:text-accentLight"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className={`absolute inset-0 rounded-xl -z-10 ${
                        lightMode ? "bg-accentDark shadow-md shadow-accentDark/20" : "bg-accentLight shadow-md shadow-accentLight/20"
                      }`}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center opacity-60">
            <p className="text-xl font-medium">
              {arabicLang 
                ? "لا توجد مشاريع في هذا التصنيف حالياً." 
                : "No projects in this category yet."}
            </p>
          </div>
        ) : (
          <div className="py-8 w-full overflow-hidden relative">
            <Swiper
              key={activeTab}
              effect={"coverflow"}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 220,
                modifier: 1.2,
                scale: 0.92,
                slideShadows: false,
              }}
              className="portfolio-swiper w-full pb-12!"
              dir={arabicLang ? "rtl" : "ltr"}
              onSwiper={(swiper) => swiper.autoplay.start()}
            >
              {filteredProjects.map((project: Project, index) => (
                <SwiperSlide
                  key={project.id}
                  className="flex items-center justify-center"
                  style={{
                    width: "min(85vw, 450px)",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative h-full flex w-full"
                  >
                    <div
                      className={`
                        project-card relative overflow-hidden rounded-2xl h-[420px] w-full flex flex-col
                      ${
                        lightMode
                          ? "bg-primaryDark text-textDark"
                          : "bg-primaryLight text-textLight"
                      }
                      ${
                        lightMode
                          ? "shadow-xl shadow-subtleDark/10 hover:shadow-2xl hover:shadow-subtleDark/20"
                          : "shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/40"
                      }
                      border ${
                        lightMode
                          ? "border-subtleDark/15 hover:border-accentDark/50"
                          : "border-subtleLight/15 hover:border-accentLight/50"
                      }
                      transition-all duration-500
                    `}
                  >
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden shrink-0 bg-subtleLight/10">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : null}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                        {project.liveUrl && (
                          <Link
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/20 hover:bg-white/40 rounded-full transition-all hover:scale-110"
                            title={arabicLang ? "رابط حي" : "Live Demo"}
                          >
                            <FiExternalLink className="w-5 h-5 text-white" />
                          </Link>
                        )}
                        {project.githubUrl && (
                          <Link
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/20 hover:bg-white/40 rounded-full transition-all hover:scale-110"
                            title={arabicLang ? "مستودع الكود" : "Source Code"}
                          >
                            <FiGithub className="w-5 h-5 text-white" />
                          </Link>
                        )}
                      </div>

                      {/* Type Badge */}
                      <div
                        className={`absolute top-3 ${
                          arabicLang ? "left-3" : "right-3"
                        } px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm border ${
                          lightMode
                            ? "bg-white/90 text-accentDark border-white/50"
                            : "bg-black/60 text-white border-white/10"
                        }`}
                      >
                        {project.type}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Sub-category tag */}
                      <div className={`text-[11px] font-semibold mb-1.5 ${lightMode ? 'text-accentDark' : 'text-accentLight'}`}>
                        {project.category}
                      </div>
                      
                      <h3
                        className={`text-lg font-bold mb-2 line-clamp-1 transition-colors ${
                          lightMode
                            ? "group-hover:text-accentDark"
                            : "group-hover:text-accentLight"
                        }`}
                        title={project.title}
                      >
                        {project.title}
                      </h3>
                      
                      <p
                        className={`text-sm leading-relaxed line-clamp-3 mb-4 flex-1 ${
                          lightMode ? "text-textDark/70" : "text-textLight/70"
                        }`}
                      >
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="pt-4 mt-auto">
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.slice(0, 3).map((tech: string) => (
                            <div
                              key={tech}
                              className={`
                                px-2 py-1 rounded-md text-[10px] font-medium tracking-wide
                                transition-colors
                                ${
                                  lightMode
                                    ? "bg-subtleDark/10 text-textDark/80 group-hover:bg-accentDark/10 group-hover:text-accentDark"
                                    : "bg-subtleLight/10 text-textLight/80 group-hover:bg-accentLight/10 group-hover:text-accentLight"
                                }
                              `}
                              title={tech}
                            >
                              {tech}
                            </div>
                          ))}
                          {project.tech.length > 3 && (
                            <div
                              className={`
                                px-2 py-1 rounded-md text-[10px] font-medium
                                ${
                                  lightMode
                                    ? "bg-subtleDark/10 text-textDark/80"
                                    : "bg-subtleLight/10 text-textLight/80"
                                }
                              `}
                            >
                              +{project.tech.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom colored line accent */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 ${
                        lightMode
                          ? "bg-linear-to-r from-accentDark to-secondaryDark"
                          : "bg-linear-to-r from-accentLight to-secondaryLight"
                      } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                    />
                  </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div
              className={`absolute bottom-0 ${
                arabicLang ? "left-4" : "right-4"
              } flex gap-2 z-10`}
            >
              <button
                className="swiper-button-prev group relative w-10 h-10 rounded-full border transition-all hover:bg-opacity-80 flex items-center justify-center"
                style={{
                  borderColor: lightMode
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(255,255,255,0.2)",
                  backgroundColor: lightMode
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)",
                  color: lightMode ? "currentColor" : "white",
                }}
              >
                ←
              </button>
              <button
                className="swiper-button-next group relative w-10 h-10 rounded-full border transition-all hover:bg-opacity-80 flex items-center justify-center"
                style={{
                  borderColor: lightMode
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(255,255,255,0.2)",
                  backgroundColor: lightMode
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)",
                  color: lightMode ? "currentColor" : "white",
                }}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
