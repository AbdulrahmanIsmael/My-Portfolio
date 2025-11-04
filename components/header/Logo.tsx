"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { SiTechcrunch } from "react-icons/si";
import { bitcountGridSingle } from "@/styles/fonts";

const Logo = () => {
  const [logoShine, setLogoShine] = useState(false);

  const toggleLogoShine = (bool: boolean, time: number): void => {
    setTimeout(() => {
      setLogoShine(bool);
    }, time);
  };
  const shineLogoOnRender = (): void => {
    for (let i = 1; i <= 4; i++) {
      const time = i * 200;
      const state = i % 2 === 1;
      toggleLogoShine(state, time);

      if (i === 4) toggleLogoShine(true, time + 1000);
    }
  };

  useEffect(() => {
    shineLogoOnRender();
  }, []);

  return (
    <Link
      href="."
      id="personal-logo"
      className={`cursor-pointer ${bitcountGridSingle.className} antialiased flex items-center gap-3`}
    >
      <SiTechcrunch size={40} className={`${logoShine && "animate-pulse"}`} />
      <div>
        <span
          className={`text-xl sm:text-2xl md:text-3xl ${
            logoShine &&
            "text-shadow-lg text-shadow-accentLight drop-shadow-xl drop-shadow-accentLight"
          }`}
        >
          Abdulrahman
        </span>
      </div>
    </Link>
  );
};

export default Logo;
