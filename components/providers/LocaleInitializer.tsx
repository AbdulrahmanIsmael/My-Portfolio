"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

import { I_appStore } from "@/stores/types/appStore-types";
import useAppStore from "@/stores/store";

/**
 * Syncs the next-intl locale (read from cookie server-side) into the
 * Zustand arabicLang flag so that RTL direction and animations stay in sync
 * with the actual locale — including on the first page load after a language switch.
 */
const LocaleInitializer = () => {
  const locale = useLocale();
  const { setArabicLang } = useAppStore((state) => state as I_appStore);

  useEffect(() => {
    setArabicLang(locale === "ar");
  }, [locale, setArabicLang]);

  return null;
};

export default LocaleInitializer;
