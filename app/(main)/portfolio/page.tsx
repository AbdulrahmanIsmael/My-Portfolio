import type { Metadata } from "next";
import PortfolioContent from "./PortfolioContent";

export const metadata: Metadata = {
  title: "Portfolio & Projects",
  description:
    "Explore the interactive software engineering portfolio of Abdulrahman Ismael. View featured web and mobile applications, check technical skills, professional work experience, and get in touch.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Interactive Portfolio & Projects | Abdulrahman Ismael",
    description:
      "Explore the interactive software engineering portfolio of Abdulrahman Ismael. Featuring work experience, full-stack projects, and technical expertise.",
    url: "https://abdulrahman-ismael-portfolio.vercel.app/portfolio",
    siteName: "Abdulrahman Ismael Portfolio",
    images: [
      {
        url: "/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Abdulrahman Ismael - Projects and Experience Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Portfolio & Projects | Abdulrahman Ismael",
    description:
      "Explore the interactive software engineering portfolio of Abdulrahman Ismael. Featuring work experience, full-stack projects, and technical expertise.",
    images: ["/assets/images/og-image.jpg"],
  },
};

export default function Portfolio() {
  return <PortfolioContent />;
}
