import { StateCreator, create } from "zustand";

import { I_appStore } from "./types/appStore-types";
import { devtools } from "zustand/middleware";

const store: StateCreator<I_appStore> = (set) => ({
  lightMode: false,
  arabicLang: false,
  toggleLightMode: () => set((state) => ({ lightMode: !state.lightMode })),
  toggleArabicLang: () => set((state) => ({ arabicLang: !state.arabicLang })),
  setLightMode: (bool: boolean) => set(() => ({ lightMode: bool })),
  setArabicLang: (bool: boolean) => set(() => ({ arabicLang: bool })),
});

const useAppStore = create<I_appStore>()(
  process.env.NODE_ENV === "development"
    ? (devtools(store) as StateCreator<I_appStore>)
    : store,
);

export default useAppStore;
