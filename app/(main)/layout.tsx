import { DataProvider } from "@/components/providers/DataProvider";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Socials from "@/components/sections/Socials";
import { promises as fs } from "fs";
import { metadataKeywords } from "@/lib/constants/metadata-constants";
import path from "path";

const projects = JSON.parse(
  await fs.readFile(path.join(process.cwd(), "data", "projects.json"), "utf8"),
);
const skills = JSON.parse(
  await fs.readFile(path.join(process.cwd(), "data", "skills.json"), "utf8"),
);
const experience = JSON.parse(
  await fs.readFile(
    path.join(process.cwd(), "data", "experience.json"),
    "utf8",
  ),
);
const socials = JSON.parse(
  await fs.readFile(path.join(process.cwd(), "data", "socials.json"), "utf8"),
);

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://abdulrahman-ismael-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Abdulrahman Ismael | Software Engineer & Full-Stack Developer",
    template: "%s | Abdulrahman Ismael",
  },
  description:
    "Bilingual (English/Arabic) Software Engineer specializing in building complete, high-performance web and mobile products across Frontend, Backend, Mobile, and Database layers.",
  keywords: metadataKeywords,
  authors: [
    {
      name: "Abdulrahman Ismael",
      url: "https://www.linkedin.com/in/abdulrahmanismael",
    },
  ],
  creator: "Abdulrahman Ismael",
  publisher: "Abdulrahman Ismael",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Abdulrahman Ismael Portfolio",
    title: "Abdulrahman Ismael | Software Engineer & Full-Stack Developer",
    description:
      "Bilingual (English/Arabic) Software Engineer specializing in Next.js, React, Node.js, React Native, and robust database design. Explore my projects and professional journey.",
    images: [
      {
        url: "/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Abdulrahman Ismael - Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdulrahman Ismael | Software Engineer & Full-Stack Developer",
    description:
      "Bilingual (English/Arabic) Software Engineer specializing in Next.js, React, Node.js, React Native, and robust database design. Explore my projects and professional journey.",
    images: ["/assets/images/og-image.jpg"],
  },
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = { projects, skills, experience, socials };

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        name: "Abdulrahman Ismael",
        alternateName: "عبدالرحمن إسماعيل",
        url: baseUrl,
        image: `${baseUrl}/assets/images/personal-photo.png`,
        jobTitle: "Software Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Freelance",
        },
        description:
          "Bilingual (English/Arabic) Software Engineer specializing in building complete, high-performance web and mobile products across Frontend, Backend, Mobile, and Database layers.",
        email: "mailto:abdulrahmanismael2023@gmail.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Giza",
          addressCountry: "EG",
        },
        sameAs: [
          socials?.linkedin || "https://www.linkedin.com/in/abdulrahmanismael",
          socials?.github || "https://github.com/AbdulrahmanIsmael",
          socials?.gitlab || "https://gitlab.com/AbdulrahmanIsmael1",
          socials?.stackOverflow ||
            "https://stackoverflow.com/users/21447470/abdulrahman-ismael",
          socials?.behance || "https://www.behance.net/abdulrahmanIsmae",
        ].filter(Boolean),
        knowsAbout: [
          "React.js",
          "Next.js",
          "TypeScript",
          "JavaScript",
          "Node.js",
          "Express.js",
          "Angular",
          "React Native",
          "Tailwind CSS",
          "SQL",
          "MySQL",
          "Microsoft SQL Server",
          "Full-Stack Web Development",
          "Frontend Engineering",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Abdulrahman Ismael Portfolio",
        description:
          "Official portfolio of Abdulrahman Ismael, a Software Engineer & Full-Stack Developer.",
        publisher: {
          "@id": `${baseUrl}/#person`,
        },
        inLanguage: ["en", "ar"],
      },
      {
        "@type": "ProfilePage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl,
        name: "Abdulrahman Ismael | Software Engineer & Full-Stack Developer",
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        about: {
          "@id": `${baseUrl}/#person`,
        },
        mainEntity: {
          "@id": `${baseUrl}/#person`,
        },
      },
    ],
  };

  return (
    <DataProvider data={data}>
      <JsonLd data={schemaData} />
      <Header />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
      <Socials />
    </DataProvider>
  );
}
