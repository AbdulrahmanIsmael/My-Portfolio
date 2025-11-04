"use client";

import { I_appStore } from "@/stores/types/appStore-types";
import { I_titleProps } from "@/types/components-types";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";

const Title = ({ children, subtitle, align = "center" }: I_titleProps) => {
  const { lightMode } = useAppStore((state) => state as I_appStore);

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col gap-3 pb-8 max-lg:text-center ${alignmentClasses[align]}`}
    >
      <div className="container mx-auto">
        {/* Main title */}
        <h2
          className={`text-4xl md:text-5xl font-semibold tracking-tight ${
            lightMode ? "text-textDark" : "text-textLight"
          }`}
        >
          {children}
        </h2>

        {/* Accent line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-1 rounded-full max-lg:mx-auto max-lg:w-[150px]! ${
            lightMode ? "bg-accentDark" : "bg-accentLight"
          }`}
        />

        {/* Subtitle (optional) */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-lg md:text-xl mt-2 ${
              lightMode ? "text-subtleDark" : "text-subtleLight"
            }`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.section>
  );
};

export default Title;
