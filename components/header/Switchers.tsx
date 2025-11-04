"use client";

import { I_appStore } from "@/stores/types/appStore-types";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";

const Switchers = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: string;
}) => {
  // using the store
  const { lightMode, toggleLightMode, arabicLang, toggleArabicLang } =
    useAppStore((state) => state as I_appStore);

  // handle toggling the switch
  const handleToggleSwitch = async () => {
    switch (type) {
      case "mode":
        toggleLightMode();
        break;
      case "language":
        toggleArabicLang();
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`cursor-pointer relative w-13 h-6 ${
        lightMode ? "bg-subtleLight" : "bg-white"
      } rounded-4xl`}
      id="mode-switcher"
      onClick={handleToggleSwitch}
    >
      <motion.div
        initial={{ left: 0, right: "auto" }}
        animate={
          (type === "mode" && lightMode) || (type === "language" && arabicLang)
            ? { right: 0, left: "auto" }
            : { left: 0, right: "auto" }
        }
        transition={{ ease: "linear", duration: 0.15 }}
        className={`absolute top-0 left-0 rounded-[100px] w-6 h-full bg-accentLight`}
      ></motion.div>
      {children}
    </div>
  );
};

export default Switchers;
