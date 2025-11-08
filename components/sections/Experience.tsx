"use client";

import { HiAcademicCap, HiBriefcase } from "react-icons/hi";

import { I_appStore } from "@/stores/types/appStore-types";
import Title from "@/components/ui/Title";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { useTranslations } from "next-intl";

const Experience = () => {
  const { arabicLang, lightMode } = useAppStore((state) => state as I_appStore);
  const experienceMessages = useTranslations(
    `Portfolio.Experience.${arabicLang ? "ar" : "en"}`
  );

  const experiences = [
    {
      id: 1,
      type: "work",
      title: experienceMessages("freelance.title"),
      company: experienceMessages("freelance.company"),
      location: experienceMessages("freelance.location"),
      date: experienceMessages("freelance.date"),
      description: experienceMessages("freelance.description"),
      projects: [
        {
          name: experienceMessages("freelance.project1.name"),
          desc: experienceMessages("freelance.project1.desc"),
        },
        {
          name: experienceMessages("freelance.project2.name"),
          desc: experienceMessages("freelance.project2.desc"),
        },
      ],
    },
    {
      id: 2,
      type: "training",
      title: experienceMessages("training.title"),
      company: experienceMessages("training.company"),
      location: experienceMessages("training.location"),
      date: experienceMessages("training.date"),
      description: experienceMessages("training.description"),
      achievements: [
        experienceMessages("training.achievement1"),
        experienceMessages("training.achievement2"),
        experienceMessages("training.achievement3"),
      ],
    },
  ];

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto flex flex-col gap-5">
        <Title
          subtitle={experienceMessages("subTitle")}
          align={arabicLang ? "right" : "left"}
        >
          {experienceMessages("title")}
        </Title>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div
            className={`absolute ${
              arabicLang ? "right-[19px]" : "left-[19px]"
            } top-0 bottom-0 w-0.5 ${
              lightMode ? "bg-subtleDark/30" : "bg-subtleLight/30"
            }`}
          />

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: arabicLang ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex gap-8 items-start`}
              >
                {/* Icon */}
                <div
                  className={`
                    shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10
                    ${
                      lightMode
                        ? "bg-accentDark text-primaryDark"
                        : "bg-accentLight text-primaryLight"
                    }
                    shadow-lg
                  `}
                >
                  {exp.type === "work" ? (
                    <HiBriefcase className="w-5 h-5" />
                  ) : (
                    <HiAcademicCap className="w-5 h-5" />
                  )}
                </div>

                {/* Content Card */}
                <div className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      p-6 rounded-xl backdrop-blur-sm
                      ${
                        lightMode
                          ? "bg-primaryDark text-textDark"
                          : "bg-primaryLight text-textLight"
                      }
                      ${
                        lightMode
                          ? "shadow-lg shadow-subtleDark/20"
                          : "shadow-lg shadow-subtleLight/20"
                      }
                      border ${
                        lightMode
                          ? "border-subtleDark/30"
                          : "border-subtleLight/30"
                      }
                    `}
                  >
                    {/* Date Badge */}
                    <div
                      className={`
                        inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3
                        ${
                          lightMode
                            ? "bg-accentDark/20 text-accentDark"
                            : "bg-accentLight/20 text-accentLight"
                        }
                      `}
                    >
                      {exp.date}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>

                    {/* Company & Location */}
                    <div
                      className={`flex items-center gap-2 mb-4 text-sm ${
                        lightMode ? "text-textDark/70" : "text-textLight/70"
                      }`}
                    >
                      <span className="font-semibold">{exp.company}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </div>

                    {/* Description */}
                    <p
                      className={`mb-4 leading-relaxed ${
                        lightMode ? "text-textDark/80" : "text-textLight/80"
                      }`}
                    >
                      {exp.description}
                    </p>

                    {/* Projects (for freelance) */}
                    {exp.projects && (
                      <div className="space-y-3">
                        {exp.projects.map((project, idx) => (
                          <div
                            key={idx}
                            className={`
                              p-4 rounded-lg
                              ${
                                lightMode
                                  ? "bg-primaryLight/10"
                                  : "bg-primaryDark/10"
                              }
                            `}
                          >
                            <h4
                              className={`font-semibold mb-1 ${
                                lightMode
                                  ? "text-accentDark"
                                  : "text-accentLight"
                              }`}
                            >
                              {project.name}
                            </h4>
                            <p
                              className={`text-sm ${
                                lightMode
                                  ? "text-textDark/70"
                                  : "text-textLight/70"
                              }`}
                            >
                              {project.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Achievements (for training) */}
                    {exp.achievements && (
                      <ul
                        className={`space-y-2 ${arabicLang ? "pr-5" : "pl-5"}`}
                      >
                        {exp.achievements.map((achievement, idx) => (
                          <li
                            key={idx}
                            className={`
                              relative text-sm leading-relaxed
                              ${
                                lightMode
                                  ? "text-textDark/80"
                                  : "text-textLight/80"
                              }
                              ${
                                arabicLang
                                  ? "before:-right-5"
                                  : "before:-left-5"
                              }
                              before:content-[''] before:absolute before:top-2.5 before:w-2 before:h-2 before:rounded-full
                              ${
                                lightMode
                                  ? "before:bg-accentDark"
                                  : "before:bg-accentLight"
                              }
                            `}
                          >
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
