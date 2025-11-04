"use client";

import BtnLink from "@/components/ui/BtnLink";
import DownloadCV from "./DownloadCV";
import { I_appStore } from "@/stores/types/appStore-types";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { useTranslations } from "next-intl";

const PersonalDetails = () => {
  const { lightMode, arabicLang } = useAppStore((state) => state as I_appStore);
  const homeMessages = useTranslations(`Home.${arabicLang ? "ar" : "en"}`);

  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{
        scale: 1,
        transition: { ease: "circIn" },
      }}
      className="flex flex-col items-center gap-3"
    >
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl ${
          lightMode ? "text-textDark" : "text-textLight"
        } text-center`}
      >
        {homeMessages("name")}
      </h2>
      <p
        className={`text-lg sm:text-xl md:text-2xl ${
          lightMode ? "text-textDark" : "text-textLight"
        } text-center`}
      >
        {homeMessages("profession")}
      </p>
      <div className="mt-5 flex items-center gap-5 flex-wrap">
        <BtnLink href="portfolio">{homeMessages("buttons.whoAmI")}</BtnLink>
        <DownloadCV />
      </div>
    </motion.div>
  );
};

export default PersonalDetails;
