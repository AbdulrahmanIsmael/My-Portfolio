import "@/styles/global.css";

import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import Socials from "@/components/sections/Socials";
import { inter } from "@/styles/fonts";
import { metadataKeywords } from "@/lib/constants/metadata-constants";

export const metadata: Metadata = {
  title: "Abdulrahman Ismael | Portfolio",
  description:
    "Abdulrahman Ismael's Portfolio - Personal Info, Contact Info, Projects, Freelancing",
  authors: [
    {
      name: "Abdulrahman Ismael",
      url: "https://www.linkedin.com/in/abdulrahmanismael/",
    },
  ],
  keywords: metadataKeywords,
  creator: "Abdulrahman Ismael",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <Header />
          <main>
            <div className="container">{children}</div>
          </main>
          <Footer />
        </NextIntlClientProvider>
        <Socials />
      </body>
    </html>
  );
}
