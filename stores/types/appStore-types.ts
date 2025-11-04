export interface I_appStore {
  lightMode: boolean;
  arabicLang: boolean;
  toggleLightMode: () => void;
  toggleArabicLang: () => void;
  setLightMode: (bool: boolean) => void;
  setArabicLang: (bool: boolean) => void;
}
