"use client";

import { I_appStore } from "@/stores/types/appStore-types";
import Image from "next/image";
import SocialMedia from "../ui/SocialMedia";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { useTranslations } from "next-intl";

const Showcase = () => {
  const { lightMode, arabicLang } = useAppStore((state) => state as I_appStore);
  const portfolioMessages = useTranslations(
    `Portfolio.Showcase.${arabicLang ? "ar" : "en"}`
  );

  const socials = [
    "gmail",
    "linkedin",
    "github",
    "behance",
    "stackOverflow",
    "gitlab",
  ];

  return (
    <section
      id="showcase"
      className={`overflow-hidden relative isolate bg-linear-to-r ${
        lightMode ? "from-primaryDark" : "from-primaryLight"
      } to-accentLight ${lightMode ? "text-textDark" : "text-textLight"} px-2`}
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col justify-center items-center lg:items-start gap-2 py-12 md:py-20 w-full"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-start"
          >
            {portfolioMessages("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl font-medium tracking-wide text-center lg:text-start"
          >
            {portfolioMessages("small")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-5 text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed text-center lg:text-start"
          >
            {portfolioMessages("brief")}
          </motion.p>

          <div className="flex items-center gap-4 mt-10">
            {socials.map((social, index) => (
              <motion.div
                key={social}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="flex items-center"
              >
                <div className="p-2 md:p-3 rounded-full bg-white/10 dark:bg-black/20 hover:scale-105 transition-transform duration-200">
                  <SocialMedia social={social} delay={index * 0.2} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: arabicLang ? -1000 : 500 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "circIn" }}
          className={`absolute opacity-40 ${
            arabicLang ? "left-0" : "right-0"
          } top-1/2 -translate-y-[45%] -z-10`}
        >
          <Image
            src="/assets/images/personal-image-cutout.png"
            alt="Personal Image"
            width={500}
            height={500}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Showcase;
