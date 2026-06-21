"use client";

import * as Si from "react-icons/si";
import * as Pi from "react-icons/pi";
import * as Di from "react-icons/di";
import * as Ri from "react-icons/ri";
import * as Tb from "react-icons/tb";
import { MdStar } from "react-icons/md";

import { I_appStore } from "@/stores/types/appStore-types";
import Title from "@/components/ui/Title";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { useTranslations } from "next-intl";
import { useData } from "@/components/providers/DataProvider";

// Unified icon pool — same as Skills Manager dashboard
const ICON_POOL_RAW: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }> | undefined
> = {
  // ─── Frontend ───────────────────────────────────────────────
  SiHtml5: Si.SiHtml5,
  SiCss3: Si.SiCss3,
  SiSass: Si.SiSass,
  SiJavascript: Si.SiJavascript,
  SiTypescript: Si.SiTypescript,
  SiReact: Si.SiReact,
  SiAngular: Si.SiAngular,
  SiRedux: Si.SiRedux,
  SiReactrouter: Si.SiReactrouter,
  SiReactquery: Si.SiReactquery,
  SiReacthookform: Si.SiReacthookform,
  TbBrandRedux: Tb.TbBrandRedux,
  SiNextdotjs: Si.SiNextdotjs,
  SiTailwindcss: Si.SiTailwindcss,
  SiBootstrap: Si.SiBootstrap,
  SiVuedotjs: Si.SiVuedotjs,
  SiSvelte: Si.SiSvelte,
  SiNuxtdotjs: Si.SiNuxtdotjs,
  SiAstro: Si.SiAstro,
  // ─── Styling / UI Libs ──────────────────────────────────────
  SiStyledcomponents: Si.SiStyledcomponents,
  SiFramer: Si.SiFramer,
  SiChakraui: Si.SiChakraui,
  SiMui: Si.SiMui,
  SiAntdesign: Si.SiAntdesign,
  SiThreedotjs: Si.SiThreedotjs,
  // ─── Mobile ─────────────────────────────────────────────────
  TbBrandReactNative: Tb.TbBrandReactNative,
  SiExpo: Si.SiExpo,
  SiKotlin: Si.SiKotlin,
  SiFlutter: Si.SiFlutter,
  SiDart: Si.SiDart,
  SiAndroid: Si.SiAndroid,
  SiSwift: Si.SiSwift,
  TbBrandKotlin: Tb.TbBrandKotlin,
  TbBrandFlutter: Tb.TbBrandFlutter,
  TbBrandSwift: Tb.TbBrandSwift,
  // ─── Backend ─────────────────────────────────────────────────
  SiNodedotjs: Si.SiNodedotjs,
  SiPhp: Si.SiPhp,
  SiLaravel: Si.SiLaravel,
  SiNestjs: Si.SiNestjs,
  SiDjango: Si.SiDjango,
  SiFlask: Si.SiFlask,
  SiFastapi: Si.SiFastapi,
  SiSpring: Si.SiSpring,
  SiRuby: Si.SiRuby,
  SiPrisma: Si.SiPrisma,
  SiRedis: Si.SiRedis,
  // ─── Databases ───────────────────────────────────────────────
  SiMysql: Si.SiMysql,
  SiSqlite: Si.SiSqlite,
  SiMongodb: Si.SiMongodb,
  SiPostgresql: Si.SiPostgresql,
  SiFirebase: Si.SiFirebase,
  SiSupabase: Si.SiSupabase,
  SiGraphql: Si.SiGraphql,
  TbBrandMysql: Tb.TbBrandMysql,
  TbBrandMongodb: Tb.TbBrandMongodb,
  TbSql: Tb.TbSql,
  // ─── Languages ───────────────────────────────────────────────
  SiPython: Si.SiPython,
  SiRust: Si.SiRust,
  SiGo: Si.SiGo,
  SiCplusplus: Si.SiCplusplus,
  TbBrandGolang: Tb.TbBrandGolang,
  TbBrandPython: Tb.TbBrandPython,
  TbBrandCpp: Tb.TbBrandCpp,
  // ─── Testing ─────────────────────────────────────────────────
  SiJest: Si.SiJest,
  SiVitest: Si.SiVitest,
  SiCypress: Si.SiCypress,
  SiStorybook: Si.SiStorybook,
  // ─── Build / Bundlers ────────────────────────────────────────
  SiVite: Si.SiVite,
  SiWebpack: Si.SiWebpack,
  SiGulp: Si.SiGulp,
  SiEslint: Si.SiEslint,
  SiPrettier: Si.SiPrettier,
  SiBabel: Si.SiBabel,
  // ─── Tools / Editors ────────────────────────────────────────
  SiGit: Si.SiGit,
  SiGithub: Si.SiGithub,
  SiGitlab: Si.SiGitlab,
  SiJira: Si.SiJira,
  SiPug: Si.SiPug,
  SiFigma: Si.SiFigma,
  DiVisualstudio: Di.DiVisualstudio,
  RiCursorLine: Ri.RiCursorLine,
  SiNpm: Si.SiNpm,
  SiYarn: Si.SiYarn,
  SiPostman: Si.SiPostman,
  SiVercel: Si.SiVercel,
  SiNetlify: Si.SiNetlify,
  SiDocker: Si.SiDocker,
  // ─── Office ──────────────────────────────────────────────────
  PiMicrosoftWordLogo: Pi.PiMicrosoftWordLogo,
  PiMicrosoftExcelLogo: Pi.PiMicrosoftExcelLogo,
  PiMicrosoftPowerpointLogo: Pi.PiMicrosoftPowerpointLogo,
  // ─── Operating Systems ───────────────────────────────────────
  PiWindowsLogo: Pi.PiWindowsLogo,
  SiLinux: Si.SiLinux,
  SiApple: Si.SiApple,
};

// Filter out any undefined entries (icons that don't exist in the installed version)
const ICON_POOL = Object.fromEntries(
  Object.entries(ICON_POOL_RAW).filter(([, v]) => v !== undefined),
) as Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
>;

const Skills = () => {
  const { arabicLang, lightMode } = useAppStore((state) => state as I_appStore);
  const aboutMessages = useTranslations("Portfolio.Skills");
  const catMessages = useTranslations("Portfolio.Skills.categories");
  const { skills: skillsData } = useData();

  // Helper to safely get the category translation, or fallback to the raw key, 
  // replacing hyphens with spaces and capitalizing it.
  const getCategoryName = (categoryKey: string) => {
    try {
      const translated = catMessages(categoryKey);
      // next-intl returns the key itself if not found (or throws based on config), 
      // but usually we can check if it strictly equals the key or has translation
      if (translated && translated !== `Portfolio.Skills.categories.${categoryKey}`) {
        return translated;
      }
    } catch (e) {
      // Ignore error and fall through to fallback
    }
    
    // Fallback: format "my-custom-group" -> "My Custom Group"
    return categoryKey
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <section id="skills" className="py-20 flex flex-col gap-5">
      <Title
        subtitle={aboutMessages("subTitle")}
        align={arabicLang ? "right" : "left"}
      >
        {aboutMessages("title")}
      </Title>

      <div className="container mx-auto flex flex-col gap-8">
        {skillsData.map((category: any, categoryIndex: number) => (
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
              {getCategoryName(category.category)}
            </h3>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {category.skills.map((skill: any, skillIndex: number) => {
                const IconComp = ICON_POOL[skill.icon] || MdStar;
                return (
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
                      transition: { delay: 0 },
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
                    <IconComp
                      className="w-12 h-12"
                      style={{ color: skill.color }}
                    />
                    <span className="text-sm font-medium text-center">
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
