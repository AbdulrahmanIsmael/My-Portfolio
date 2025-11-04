"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const PersonalImage = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{
        scale: 1,
        transition: { ease: "circIn" },
      }}
      whileTap={{
        rotateY: 180,
        transition: { ease: "anticipate" },
      }}
    >
      <Image
        src="/assets/images/personal-photo.png"
        alt="My Personal Photo - Abdulrahman Isnmael"
        width={300}
        height={300}
        className="rounded-[100%] border-4 border-dashed border-accentLight transition-all duration-500 cursor-pointer"
      />
    </motion.div>
  );
};

export default PersonalImage;
