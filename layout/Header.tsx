"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

import { I_appStore } from "@/stores/types/appStore-types";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/header/Logo";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import Switchers from "@/components/header/Switchers";
import useAppStore from "@/stores/store";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const Header = () => {
  const pathname = usePathname();

  const { lightMode, arabicLang } = useAppStore((state) => state as I_appStore);
  const headerMessages = useTranslations(
    `Header.titles.${arabicLang ? "ar" : "en"}`
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navLinks = [
    {
      value: headerMessages("showcase"),
      href: "#showcase",
    },
    {
      value: headerMessages("about"),
      href: "#about",
    },
    {
      value: headerMessages("skills"),
      href: "#skills",
    },
    {
      value: headerMessages("projects"),
      href: "#projects",
    },
    {
      value: headerMessages("experience"),
      href: "#experience",
    },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: 0,
        boxShadow: isScrolled
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          : "none",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${
        lightMode ? "bg-primaryDark" : "bg-primaryLight"
      } backdrop-blur-md ${
        lightMode ? "text-textDark" : "text-textLight"
      } border-b border-subtleLight/20 sticky top-0 z-50`}
    >
      <motion.div
        animate={{
          paddingTop: isScrolled ? "0.75rem" : "1.25rem",
          paddingBottom: isScrolled ? "0.75rem" : "1.25rem",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="container mx-auto flex max-lg:flex-col gap-y-6 items-center justify-between"
      >
        <Logo />
        <nav
          hidden={pathname === "/"}
          className="flex items-center"
          dir={arabicLang ? "rtl" : "ltr"}
        >
          <ul className="flex items-center gap-8">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className={`
          relative font-medium text-sm tracking-wide uppercase
          transition-all duration-300
          ${
            lightMode
              ? "text-textDark/70 hover:text-accentDark"
              : "text-textLight/70 hover:text-accentLight"
          }
          after:content-[''] after:absolute after:left-0 after:-bottom-1 
          after:w-0 after:h-0.5 
          after:transition-all after:duration-300
          ${lightMode ? "after:bg-accentDark" : "after:bg-accentLight"}
          hover:after:w-full
        `}
                >
                  {link.value}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-center gap-3">
          <Switchers type="mode">
            <MdDarkMode
              className="absolute right-15 top-1/2 -translate-y-1/2"
              size={25}
              fill="gray"
            />
            <MdLightMode
              size={25}
              fill="yellow"
              className="absolute left-15 top-1/2 -translate-y-1/2"
            />
          </Switchers>

          <Switchers type="language">
            <Image
              src="/assets/icons/english.png"
              alt="English Language"
              className="absolute right-15 top-1/2 -translate-y-1/2"
              width={25}
              height={25}
            />
            <Image
              src="/assets/icons/arabic.png"
              alt="Arabic Language"
              width={25}
              height={25}
              className="absolute left-15 top-1/2 -translate-y-1/2"
            />
          </Switchers>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
