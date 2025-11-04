"use client";

import { HiDownload, HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";

import DownloadCV from "./DownloadCV";
import { I_appStore } from "@/stores/types/appStore-types";
import Link from "next/link";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";

const AboutDetails = ({
  title,
  profession,
  description,
  contactTitle,
  contactEmail,
  contactPhone,
  contactLocation,
  location,
}: {
  title: string;
  profession: string;
  description: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  location: string;
}) => {
  const { lightMode } = useAppStore((state) => state as I_appStore);

  const contactInfo = [
    {
      icon: HiMail,
      label: contactEmail,
      value: "abdulrahmanismael2023@gmail.com",
      href: "mailto:abdulrahmanismael2023@gmail.com",
    },
    {
      icon: HiPhone,
      label: contactPhone,
      value: "+20 111 459 6793",
      href: "tel:+201114596793",
    },
    {
      icon: HiLocationMarker,
      label: contactLocation,
      value: location,
      href: null,
    },
  ];

  return (
    <div
      className={`
        w-full p-8 md:p-12 rounded-xl
        ${
          lightMode
            ? "bg-primaryDark text-textDark"
            : "bg-primaryLight text-textLight"
        }
        ${
          lightMode
            ? "shadow-lg shadow-subtleDark/20"
            : "shadow-lg shadow-subtleLight/20"
        }
        border ${lightMode ? "border-subtleDark/30" : "border-subtleLight/30"}
        backdrop-blur-sm
      `}
    >
      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-semibold text-center mb-3"
      >
        {title}
      </motion.h2>

      {/* Animated Divider */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`h-1 rounded-full mb-10 mt-5 ${
          lightMode ? "bg-accentDark" : "bg-accentLight"
        }`}
      />

      {/* Profession/Job Title */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`text-2xl md:text-3xl font-medium text-center mb-8 ${
          lightMode ? "text-accentDark" : "text-accentLight"
        }`}
      >
        {profession}
      </motion.h3>

      {/* Career Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`text-base md:text-lg leading-relaxed mb-12 text-center max-w-3xl mx-auto ${
          lightMode ? "text-textDark/80" : "text-textLight/80"
        }`}
      >
        {description}
      </motion.p>

      {/* Contact Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`
          p-6 rounded-lg mb-6
          ${lightMode ? "bg-primaryLight/10" : "bg-primaryDark/10"}
          border ${lightMode ? "border-subtleDark/20" : "border-subtleLight/20"}
        `}
      >
        <h4 className="text-xl font-semibold mb-4 text-center">
          {contactTitle}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactInfo.map((contact, index) => (
            <motion.div
              key={contact.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <contact.icon
                className={`w-6 h-6 ${
                  lightMode ? "text-accentDark" : "text-accentLight"
                }`}
              />
              <span className="text-sm font-medium">{contact.label}</span>
              {contact.href ? (
                <Link
                  dir="ltr"
                  href={contact.href}
                  className={`text-sm text-center transition-colors ${
                    lightMode
                      ? "text-textDark/70 hover:text-accentDark"
                      : "text-textLight/70 hover:text-accentLight"
                  }`}
                >
                  {contact.value}
                </Link>
              ) : (
                <span
                  className={`text-sm text-center ${
                    lightMode ? "text-textDark/70" : "text-textLight/70"
                  }`}
                >
                  {contact.value}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Download CV Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex justify-center mt-15"
      >
        <DownloadCV />
      </motion.div>
    </div>
  );
};

export default AboutDetails;
