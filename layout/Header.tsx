"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { MdClose, MdDarkMode, MdLightMode, MdMenu } from "react-icons/md";
import { useEffect, useState } from "react";

import { I_appStore } from "@/stores/types/appStore-types";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/header/Logo";
import Switchers from "@/components/header/Switchers";
import useAppStore from "@/stores/store";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const Header = () => {
  const pathname = usePathname();
  const { lightMode, arabicLang } = useAppStore((state) => state as I_appStore);
  const headerMessages = useTranslations(
    `Header.titles.${arabicLang ? "ar" : "en"}`,
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
    {
      value: headerMessages("contact"),
      href: "#contact",
    },
  ];

  return (
    <>
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
          className="container mx-auto flex max-[320px]:flex-col gap-y-3 items-center justify-between px-4"
        >
          <Logo />

          {/* Desktop Navigation */}
          <nav
            hidden={pathname === "/"}
            className="hidden lg:flex items-center"
            dir={arabicLang ? "rtl" : "ltr"}
          >
            <ul className="flex items-center gap-6">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className={`
                      relative font-medium text-sm tracking-normal uppercase
                      transition-all duration-300
                      ${
                        lightMode
                          ? "text-textDark/70 hover:text-accentDark"
                          : "text-textLight/70 hover:text-accentLight"
                      }
                      after:content-[''] after:absolute after:left-0 after:-bottom-1 
                      after:w-0 after:h-0.5 
                      after:transition-all after:duration-300
                      ${
                        lightMode
                          ? "after:bg-accentDark"
                          : "after:bg-accentLight"
                      }
                      hover:after:w-full
                    `}
                  >
                    {link.value}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Switchers */}
          <div className="max-md:hidden flex flex-col items-center gap-2">
            <Switchers type="mode">
              <span title={lightMode ? "Dark Mode" : "Light Mode"}>
                {lightMode ? (
                  <MdDarkMode size={26} />
                ) : (
                  <MdLightMode size={26} fill="yellow" />
                )}
              </span>
            </Switchers>

            <Switchers type="language">
              <span title={arabicLang ? "English" : "Arabic"}>
                <Image
                  src={
                    arabicLang
                      ? "/assets/icons/english.png"
                      : "/assets/icons/arabic.png"
                  }
                  alt={arabicLang ? "Switch to English" : "Switch to Arabic"}
                  width={26}
                  height={26}
                  className="transition-transform duration-300"
                />
              </span>
            </Switchers>
          </div>

          {/* Mobile Menu Button */}
          {pathname !== "/" && (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`cursor-pointer 
                md:hidden p-2 rounded-lg transition-colors
                ${
                  lightMode
                    ? "hover:bg-primaryLight/10"
                    : "hover:bg-primaryDark/10"
                }
              `}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
            </button>
          )}
        </motion.div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && pathname !== "/" && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: arabicLang ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: arabicLang ? "100%" : "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`
                fixed top-0 ${arabicLang ? "right-0" : "left-0"} 
                h-full w-80 max-w-[85vw] z-50 lg:hidden
                ${lightMode ? "bg-primaryDark" : "bg-primaryLight"}
                ${lightMode ? "text-textDark" : "text-textLight"}
                shadow-2xl overflow-y-auto
              `}
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">
                    {arabicLang ? "القائمة" : "Menu"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`cursor-pointer 
                      p-2 rounded-lg transition-colors
                      ${
                        lightMode
                          ? "hover:bg-primaryLight/10"
                          : "hover:bg-primaryDark/10"
                      }
                    `}
                    aria-label="Close menu"
                  >
                    <MdClose size={24} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="mb-8">
                  <ul className="space-y-2">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: arabicLang ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={handleLinkClick}
                          className={`
                            block py-3 px-4 rounded-lg font-medium
                            transition-all duration-300
                            ${
                              lightMode
                                ? "hover:bg-primaryLight/10 hover:text-accentDark"
                                : "hover:bg-primaryDark/10 hover:text-accentLight"
                            }
                          `}
                        >
                          {link.value}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Divider */}
                <div
                  className={`
                    h-px w-full my-6
                    ${lightMode ? "bg-subtleDark/30" : "bg-subtleLight/30"}
                  `}
                />

                {/* Switchers */}
                <div>
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-3 opacity-70">
                      {arabicLang ? "المظهر" : "Theme"}
                    </p>
                    <Switchers type="mode">
                      <span title={lightMode ? "Dark Mode" : "Light Mode"}>
                        {lightMode ? (
                          <MdDarkMode size={26} />
                        ) : (
                          <MdLightMode size={26} fill="yellow" />
                        )}
                      </span>
                    </Switchers>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-3 opacity-70">
                      {arabicLang ? "اللغة" : "Language"}
                    </p>
                    <Switchers type="language">
                      <span title={arabicLang ? "English" : "Arabic"}>
                        <Image
                          src={
                            arabicLang
                              ? "/assets/icons/english.png"
                              : "/assets/icons/arabic.png"
                          }
                          alt={
                            arabicLang
                              ? "Switch to English"
                              : "Switch to Arabic"
                          }
                          width={26}
                          height={26}
                          className="transition-transform duration-300"
                        />
                      </span>
                    </Switchers>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
