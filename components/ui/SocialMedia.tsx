"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";

const SocialMedia = ({ social, delay }: { social: string; delay: number }) => {
  const { socials: socialsData } = useData();
  const socialsLinks: Record<string, string> = socialsData;
  const href = socialsLinks[social] || "#";

  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ ease: "anticipate", delay: delay }}
      className="active:scale-110 hover:scale-110 transition-all ease-linear duration-100"
      title={social === "stackOverflow" ? "stack overflow" : social}
    >
      <Link
        href={social === "gmail" ? `mailto:${href}` : href}
        target="_blank"
      >
        <Image
          src={`/assets/icons/${social}.png`}
          alt={`${social} Link`}
          width={35}
          height={35}
        />
      </Link>
    </motion.div>
  );
};

export default SocialMedia;
