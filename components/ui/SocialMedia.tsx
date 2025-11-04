import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { socialsLinks } from "@/lib/constants/socials-constants";

const SocialMedia = ({ social, delay }: { social: string; delay: number }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ ease: "anticipate", delay: delay }}
      className="active:scale-110 hover:scale-110 transition-all ease-linear duration-100"
      title={social === "stackOverflow" ? "stack overflow" : social}
    >
      <Link
        href={
          social === "gmail"
            ? `mailto:${socialsLinks["gmail"]}`
            : socialsLinks[social]
        }
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
