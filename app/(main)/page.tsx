import HomeContent from "./HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abdulrahman Ismael | Software Engineer & Full-Stack Developer",
  description:
    "Official portfolio of Abdulrahman Ismael, a bilingual Software Engineer specializing in building full-stack digital products with Next.js, React, Node.js, and React Native. Explore projects, experience, and clean architecture.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Abdulrahman Ismael | Software Engineer & Full-Stack Developer",
    description:
      "Bilingual Software Engineer specializing in Next.js, React, Node.js, and mobile app development. Explore projects, experience, and clean architecture.",
    url: "https://abdulrahman-ismael-portfolio.vercel.app",
    siteName: "Abdulrahman Ismael Portfolio",
    images: [
      {
        url: "/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Abdulrahman Ismael - Software Engineer Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdulrahman Ismael | Software Engineer & Full-Stack Developer",
    description:
      "Bilingual Software Engineer specializing in Next.js, React, Node.js, and mobile app development. Explore projects, experience, and clean architecture.",
    images: ["/assets/images/og-image.jpg"],
  },
};

export default function Home() {
  return <HomeContent />;
}
