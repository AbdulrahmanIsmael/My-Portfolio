"use client";

import { I_appStore } from "@/stores/types/appStore-types";
import PersonalDetails from "@/components/sections/PersonalDetails";
import PersonalImage from "@/components/sections/PersonalImage";
import { bitcountGridSingle } from "@/styles/fonts";
import useAppStore from "@/stores/store";

const Home = () => {
  const { lightMode, arabicLang } = useAppStore((state) => state as I_appStore);

  return (
    <section
      dir={arabicLang ? "rtl" : "ltr"}
      className={`relative w-screen ${
        bitcountGridSingle.className
      } antialiased flex flex-col items-center justify-center py-4 px-2 gap-6 min-h-screen ${
        lightMode ? "bg-primaryDark" : "bg-primaryLight"
      }`}
    >
      <PersonalImage />
      <PersonalDetails />
    </section>
  );
};

export default Home;
