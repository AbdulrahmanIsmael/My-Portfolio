"use client";

import {
  PiMicrosoftExcelLogo,
  PiMicrosoftPowerpointLogo,
  PiMicrosoftWordLogo,
  PiWindowsLogo,
} from "react-icons/pi";
import {
  SiAngular,
  SiBootstrap,
  SiCss3,
  SiFigma,
  SiGit,
  SiGulp,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPug,
  SiReact,
  SiRedux,
  SiSass,
  SiTailwindcss,
  SiTypescript,
  SiWebpack,
} from "react-icons/si";

import { DiVisualstudio } from "react-icons/di";
import { I_appStore } from "@/stores/types/appStore-types";
import { RiCursorLine } from "react-icons/ri";
import { TbBrandRedux } from "react-icons/tb";
import Title from "@/components/ui/Title";
import { categories } from "@/lib/constants/skills-constants";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { useTranslations } from "next-intl";

const Skills = () => {
  const { arabicLang, lightMode } = useAppStore((state) => state as I_appStore);
  const aboutMessages = useTranslations(
    `Portfolio.Skills.${arabicLang ? "ar" : "en"}`,
  );
  const catLang = aboutMessages("categories");
  const cats = categories[catLang as keyof typeof categories];

  const skillCategories = [
    {
      category: cats["frontend"],
      skills: [
        { name: "HTML", icon: SiHtml5, color: "#E34F26" },
        { name: "CSS", icon: SiCss3, color: "#1572B6" },
        { name: "Sass", icon: SiSass, color: "#CC6699" },
        { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
        { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
        { name: "React", icon: SiReact, color: "#61DAFB" },
        { name: "Angular", icon: SiAngular, color: "#E52A3A" },
        { name: "Redux", icon: SiRedux, color: "#764ABC" },
        { name: "Zustand", icon: TbBrandRedux, color: "#443E38" },
        { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
        { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
        { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
      ],
    },
    {
      category: cats["backend"],
      skills: [
        { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
        { name: "PHP", icon: SiPhp, color: "#777BB4" },
        { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
        { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      ],
    },
    {
      category: cats["tools"],
      skills: [
        { name: "Git", icon: SiGit, color: "#F05032" },
        { name: "Webpack", icon: SiWebpack, color: "#8DD6F9" },
        { name: "Gulp", icon: SiGulp, color: "#CF4647" },
        { name: "Pug", icon: SiPug, color: "#A86454" },
        { name: "Figma", icon: SiFigma, color: "#F24E1E" },
        { name: "VS Code", icon: DiVisualstudio, color: "#007ACC" },
        { name: "Cursor", icon: RiCursorLine, color: "#000000" },
      ],
    },
    {
      category: cats["office"],
      skills: [
        { name: "Word", icon: PiMicrosoftWordLogo, color: "#2B579A" },
        { name: "Excel", icon: PiMicrosoftExcelLogo, color: "#217346" },
        {
          name: "PowerPoint",
          icon: PiMicrosoftPowerpointLogo,
          color: "#D24726",
        },
      ],
    },
    {
      category: cats["op"],
      skills: [
        { name: "Windows", icon: PiWindowsLogo, color: "#0078D4" },
        { name: "Linux", icon: SiLinux, color: "#FCC624" },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 flex flex-col gap-5">
      <Title
        subtitle={aboutMessages("subTitle")}
        align={arabicLang ? "right" : "left"}
      >
        {aboutMessages("title")}
      </Title>

      <div className="container mx-auto flex flex-col gap-8">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, x: arabicLang ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
          >
            {/* Category Title */}
            <h3
              className={`text-2xl font-semibold mb-4 ${
                lightMode ? "text-accentDark" : "text-accentLight"
              }`}
            >
              {category.category}
            </h3>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: categoryIndex * 0.2 + skillIndex * 0.1,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className={`
                    p-4 rounded-lg backdrop-blur-sm
                    flex flex-col items-center gap-3
                    ${
                      lightMode
                        ? "bg-primaryDark text-textDark"
                        : "bg-primaryLight text-textLight"
                    }
                    ${
                      lightMode
                        ? "shadow-md shadow-subtleDark/20"
                        : "shadow-md shadow-subtleLight/20"
                    }
                    border ${
                      lightMode
                        ? "border-subtleDark/30"
                        : "border-subtleLight/30"
                    }
                    transition-all duration-300
                  `}
                >
                  <skill.icon
                    className="w-12 h-12"
                    style={{ color: skill.color }}
                  />
                  <span className="text-sm font-medium text-center">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
