"use client";

import { I_appStore } from "@/stores/types/appStore-types";
import useAppStore from "@/stores/store";

const Switchers = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: string;
}) => {
  // using the store
  const { toggleLightMode, lightMode, toggleArabicLang } = useAppStore(
    (state) => state as I_appStore,
  );

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
      id="mode-switcher"
      onClick={handleToggleSwitch}
      className={`
      relative inline-flex items-center gap-3
      px-4 py-2
      rounded-full
      border-2 border-accentDark
      cursor-pointer select-none
      transition-all duration-300 ease-out
      hover:scale-[1.03] active:scale-[0.98]
      ${
        lightMode
          ? "bg-subtleLight/30 text-primaryLight hover:bg-subtleLight/40"
          : "bg-primaryDark text-primaryLight hover:bg-primaryDark/90"
      }
      shadow-sm hover:shadow-md
    `}
    >
      <div className="absolute inset-0 rounded-full bg-white/5 pointer-events-none" />
      {children}
    </div>
  );
};

export default Switchers;
