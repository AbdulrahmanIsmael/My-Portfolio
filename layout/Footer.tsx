"use client";

import {
  FaBehance,
  FaGithub,
  FaLinkedin,
  FaStackOverflow,
} from "react-icons/fa";
import { HiArrowUp, HiMail, HiPhone } from "react-icons/hi";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

import { I_appStore } from "@/stores/types/appStore-types";
import Link from "next/link";
import useAppStore from "@/stores/store";

const Footer = () => {
  const { lightMode, arabicLang } = useAppStore((state) => state as I_appStore);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();

  // Show button after scrolling 300px
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setShowScrollTop(latest > 300);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: FaGithub,
      href: "https://github.com/AbdulrahmanIsmael",
      color: lightMode ? "#333" : "#fff",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      href: "https://linkedin.com/in/abdulrahmanismael",
      color: "#0077B5",
    },
    {
      name: "Stack Overflow",
      icon: FaStackOverflow,
      href: "https://stackoverflow.com/users/21447470/abdulrahman-ismael",
      color: "#F48024",
    },
    {
      name: "Behance",
      icon: FaBehance,
      href: "https://www.behance.net/abdulrahmanIsmael",
      color: "#0056ff",
    },
  ];

  const quickLinks = [
    { name: arabicLang ? "الرئيسية" : "Home", href: "#home" },
    { name: arabicLang ? "عني" : "About", href: "#about" },
    { name: arabicLang ? "المهارات" : "Skills", href: "#skills" },
    { name: arabicLang ? "المشاريع" : "Projects", href: "#projects" },
    { name: arabicLang ? "الخبرات" : "Experience", href: "#experience" },
    { name: arabicLang ? "تواصل" : "Contact", href: "#contact" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className={`
          cursor-pointer fixed ${
            arabicLang ? "left-8" : "right-8"
          } bottom-8 z-50
          p-4 rounded-full shadow-lg
          ${
            lightMode
              ? "bg-accentDark hover:bg-accentHoverDark text-primaryDark"
              : "bg-accentLight hover:bg-accentHoverLight text-primaryLight"
          }
          transition-all duration-300 hover:scale-110 active:scale-95
        `}
        aria-label="Scroll to top"
      >
        <HiArrowUp className="w-6 h-6" />
      </motion.button>

      {/* Footer */}
      <footer
        dir={arabicLang ? "rtl" : "ltr"}
        className={`
          border-t
          ${
            lightMode
              ? "bg-primaryDark text-textDark border-subtleDark/30"
              : "bg-primaryLight text-textLight border-subtleLight/30"
          }
        `}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                {arabicLang ? "عبدالرحمن إسماعيل" : "Abdulrahman Ismael"}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-4 ${
                  lightMode ? "text-textDark/70" : "text-textLight/70"
                }`}
              >
                {arabicLang
                  ? "مطور واجهات أمامية ومهندس برمجيات شغوف ببناء تجارب ويب حديثة وتفاعلية"
                  : "Front-End Developer & Software Engineer passionate about building modern and interactive web experiences"}
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <Link
                  href="mailto:abdulrahmanismael2023@gmail.com"
                  className={`
                    flex items-center gap-2 text-sm transition-colors
                    ${
                      lightMode
                        ? "text-textDark/70 hover:text-accentDark"
                        : "text-textLight/70 hover:text-accentLight"
                    }
                  `}
                >
                  <HiMail className="w-4 h-4" />
                  abdulrahmanismael2023@gmail.com
                </Link>
                <Link
                  href="tel:+201114596793"
                  className={`
                    flex items-center gap-2 text-sm transition-colors
                    ${
                      lightMode
                        ? "text-textDark/70 hover:text-accentDark"
                        : "text-textLight/70 hover:text-accentLight"
                    }
                  `}
                >
                  <HiPhone className="w-4 h-4" />
                  +20 111 459 6793
                </Link>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4">
                {arabicLang ? "روابط سريعة" : "Quick Links"}
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: arabicLang ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`
                        text-sm transition-colors inline-block
                        ${
                          lightMode
                            ? "text-textDark/70 hover:text-accentDark"
                            : "text-textLight/70 hover:text-accentLight"
                        }
                        hover:translate-x-1 transition-transform
                      `}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">
                {arabicLang ? "تابعني" : "Follow Me"}
              </h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      p-3 rounded-lg transition-all
                      ${
                        lightMode
                          ? "bg-primaryLight/10 hover:bg-accentDark/20"
                          : "bg-primaryDark/10 hover:bg-accentLight/20"
                      }
                    `}
                    aria-label={social.name}
                  >
                    <social.icon
                      className="w-6 h-6"
                      style={{
                        color: lightMode ? social.color : social.color,
                      }}
                    />
                  </motion.a>
                ))}
              </div>

              {/* Additional Info */}
              <p
                className={`
                  text-xs mt-6 leading-relaxed
                  ${lightMode ? "text-textDark/60" : "text-textLight/60"}
                `}
              >
                {arabicLang
                  ? "متاح للعمل المستقل والفرص الوظيفية"
                  : "Available for freelance work and job opportunities"}
              </p>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`
              h-px w-full my-8
              ${lightMode ? "bg-subtleDark/30" : "bg-subtleLight/30"}
            `}
          />

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <p
              className={`text-sm ${
                lightMode ? "text-textDark/60" : "text-textLight/60"
              }`}
            >
              {arabicLang ? (
                <>© {currentYear} عبدالرحمن إسماعيل. جميع الحقوق محفوظة.</>
              ) : (
                <>© {currentYear} Abdulrahman Ismael. All rights reserved.</>
              )}
            </p>

            <p
              className={`text-sm ${
                lightMode ? "text-textDark/60" : "text-textLight/60"
              }`}
            >
              {arabicLang ? (
                <>
                  صُنع بـ{" "}
                  <span
                    className={
                      lightMode ? "text-accentDark" : "text-accentLight"
                    }
                  >
                    ❤️
                  </span>{" "}
                  باستخدام Next.js
                </>
              ) : (
                <>
                  Made with{" "}
                  <span
                    className={
                      lightMode ? "text-accentDark" : "text-accentLight"
                    }
                  >
                    ❤️
                  </span>{" "}
                  using Next.js
                </>
              )}
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
