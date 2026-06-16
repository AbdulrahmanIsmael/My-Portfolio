import "@/styles/global.css";

import LocaleInitializer from "@/components/providers/LocaleInitializer";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <LocaleInitializer />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

