"use client";

import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

import { I_appStore } from "@/stores/types/appStore-types";
import SocialMedia from "@/components/ui/SocialMedia";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { useState } from "react";

const Socials = () => {
  const { lightMode } = useAppStore((state) => state as I_appStore);
  const [opened, isOpenened] = useState(false);

  const socials = [
    "gmail",
    "linkedin",
    "github",
    "behance",
    "stackOverflow",
    "gitlab",
  ];

  const handleSocialsPanel = () => {
    isOpenened((prevState) => !prevState);
  };

  return (
    <motion.section
      initial={{ x: 0 }}
      animate={{ x: opened ? 0 : -75 }}
      className={`fixed top-1/2 -translate-y-1/2 left-0 flex flex-col items-center gap-6 py-3 px-2 z-50`}
    >
      {socials.map((social, index) => (
        <div
          className={`p-2 md:p-3 rounded-full ${
            lightMode ? "bg-black/20" : "bg-white/20"
          } hover:scale-105 transition-transform duration-200`}
          key={index}
        >
          <SocialMedia social={social} delay={index * 0.2} />
        </div>
      ))}
      <button
        type="button"
        title="Open/Close Social Panel"
        onClick={handleSocialsPanel}
        className={`cursor-pointer absolute -right-10 top-15 p-2 rounded-full ${
          lightMode ? "bg-black/20" : "bg-white/20"
        }`}
      >
        {opened ? (
          <LuPanelLeftClose size={25} color={lightMode ? "initial" : "white"} />
        ) : (
          <LuPanelLeftOpen size={25} color={lightMode ? "initial" : "white"} />
        )}
      </button>
    </motion.section>
  );
};

export default Socials;
