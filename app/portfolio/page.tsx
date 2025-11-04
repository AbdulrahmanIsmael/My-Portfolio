"use client";

import About from "@/components/sections/About";
import { I_appStore } from "@/stores/types/appStore-types";
import Showcase from "@/components/sections/Showcase";
import Skills from "@/components/sections/Skills";
import { bitcountGridSingle } from "@/styles/fonts";
import useAppStore from "@/stores/store";

const Portfolio = () => {
  const { lightMode, arabicLang } = useAppStore((state) => state as I_appStore);

  return (
    <section
      dir={arabicLang ? "rtl" : "ltr"}
      className={`w-screen ${
        bitcountGridSingle.className
      } antialiased min-h-screen ${
        lightMode ? "bg-primaryDark" : "bg-primaryLight"
      }`}
    >
      <Showcase />
      <About />
      <Skills />
    </section>
  );
};

export default Portfolio;
