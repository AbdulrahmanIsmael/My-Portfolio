import { I_appStore } from "./types/appStore-types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const store = (set: any): I_appStore => ({
  lightMode: false,
  arabicLang: false,
  toggleLightMode: () =>
    set((state: I_appStore) => ({ lightMode: !state.lightMode })),
  toggleArabicLang: () =>
    set((state: I_appStore) => ({ arabicLang: !state.arabicLang })),
  setLightMode: (bool: boolean) => set(() => ({ lightMode: bool })),
  setArabicLang: (bool: boolean) => set(() => ({ arabicLang: bool })),
});

const useAppStore = create(
  process.env.NODE_ENV === "development"
    ? devtools((set) => store(set))
    : (set) => store(set)
);

export default useAppStore;
