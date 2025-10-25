import type { Metadata } from "next";
import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Abdulrahman Ismael | Portfolio",
  description:
    "Abdulrahman Ismael's Portfolio - Personal Info, Contact Info, Projects, Freelancing",
  authors: [{ name: "Abdulrahman Ismael", url: "" }],
  keywords: [
    "portfolio",
    "software",
    "engineer",
    "frontend",
    "front-end",
    "web",
    "development",
    "website",
    "abdulrahman",
    "react",
    "next",
    "react.js",
    "next.js",
    "typescript",
    "javascript",
    "tailwind",
    "html",
    "css",
    "sass",
    "scss",
  ],
  creator: "Abdulrahman Ismael",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="container">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
