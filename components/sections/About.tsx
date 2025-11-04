"use client";

import AboutDetails from "./AboutDetails";
import { I_appStore } from "@/stores/types/appStore-types";
import Title from "@/components/ui/Title";
import useAppStore from "@/stores/store";
import { useTranslations } from "next-intl";

const About = () => {
  const arabicLang = useAppStore((state) => (state as I_appStore).arabicLang);
  const aboutMessages = useTranslations(
    `Portfolio.About.${arabicLang ? "ar" : "en"}`
  );
  const aboutDetailsMsg = {
    title: aboutMessages("titleBox"),
    profession: aboutMessages("profession"),
    description: aboutMessages("desc"),
    contactTitle: aboutMessages("contactTitle"),
    contactEmail: aboutMessages("contactEmail"),
    contactPhone: aboutMessages("contactPhone"),
    contactLocation: aboutMessages("contactLocation"),
    location: aboutMessages("location"),
  };
  return (
    <section id="about" className="container mx-auto py-20 flex flex-col gap-5">
      <Title
        subtitle={aboutMessages("subTitle")}
        align={arabicLang ? "right" : "left"}
      >
        {aboutMessages("title")}
      </Title>
      <AboutDetails {...aboutDetailsMsg} />
    </section>
  );
};

export default About;
