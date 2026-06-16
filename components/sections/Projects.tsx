"use client";

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
import { FiExternalLink, FiGithub } from "react-icons/fi";
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

        <div className="py-8">
          <Swiper
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
            {projects.map((project: Project) => (
              <SwiperSlide
                key={project.id}
                className="flex items-center justify-center"
                style={{
                  width: "min(85vw, 450px)",
                }}
              >
                <div className="group relative h-full">
                  {/* Card */}
                  <div
                    className={`
                    project-card relative overflow-hidden rounded-2xl h-[450px] flex flex-col
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
                      lightMode
                        ? "border-subtleDark/30"
                        : "border-subtleLight/30"
                    }
                    transition-all duration-300 group-hover:shadow-2xl
                  `}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
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
                        className={`absolute top-3 ${
                          arabicLang ? "left-3" : "right-3"
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
                    <div className="p-4 flex flex-col flex-1 overflow-hidden">
                      <h3
                        className={`text-lg font-bold transition-colors mb-2 ${
                          lightMode
                            ? "group-hover:text-accentDark"
                            : "group-hover:text-accentLight"
                        }`}
                      >
                        {project.title}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed flex-1 overflow-hidden ${
                          lightMode ? "text-textDark/70" : "text-textLight/70"
                        }`}
                      >
                        {project.description}
                      </p>

                      {/* Tech Stack Section */}
                      <div className="pt-3 border-t border-subtleLight/20 mt-auto">
                        <h4
                          className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                            lightMode ? "text-textDark/50" : "text-textLight/50"
                          }`}
                        >
                          {arabicLang ? "التقنيات" : "Tech"}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.slice(0, 4).map((tech: string) => (
                            <div
                              key={tech}
                              className={`
                              px-2 py-1 rounded text-xs font-medium
                              transition-all duration-300 hover:scale-105
                              ${
                                lightMode
                                  ? "bg-primaryLight/10"
                                  : "bg-primaryDark/10"
                              }
                            `}
                              title={tech}
                            >
                              {tech}
                            </div>
                          ))}
                          {project.tech.length > 4 && (
                            <div
                              className={`
                              px-2 py-1 rounded text-xs font-medium
                              ${
                                lightMode
                                  ? "bg-primaryLight/10"
                                  : "bg-primaryDark/10"
                              }
                            `}
                            >
                              +{project.tech.length - 4}
                            </div>
                          )}
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
                </div>
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
      </div>
    </section>
  );
};

export default Projects;
