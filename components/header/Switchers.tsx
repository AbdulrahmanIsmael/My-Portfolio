"use client";

import { I_appStore } from "@/stores/types/appStore-types";
import useAppStore from "@/stores/store";

const Switchers = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "mode" | "language";
}) => {
  const { toggleLightMode, lightMode, toggleArabicLang } = useAppStore(
    (state) => state as I_appStore,
  );

  const handleToggleSwitch = () => {
    if (type === "mode") toggleLightMode();
    if (type === "language") toggleArabicLang();
  };

  return (
    <button
      type="button"
      onClick={handleToggleSwitch}
      className={`
        cursor-pointer
        relative flex items-center justify-center
        w-10 h-10
        rounded-full
        border border-black/10 dark:border-white/10
        backdrop-blur-md
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95
        ${
          lightMode
            ? "bg-accentDark/60 hover:bg-accentHoverDark/80"
            : "bg-accentLight/10  hover:bg-accentHoverLight/20"
        }
      `}
    >
      <span className="absolute inset-0 rounded-full ring-2 ring-accentDark/5 pointer-events-none" />

      <span className="relative flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};

export default Switchers;
