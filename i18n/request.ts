import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const supportedLocales = ["en", "ar"];
const defaultLocale = "en";

import { promises as fs } from "fs";
import path from "path";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  const locale = supportedLocales.includes(cookieLocale ?? "")
    ? cookieLocale!
    : defaultLocale;

  const localePath = path.join(process.cwd(), "locales", `${locale}.json`);
  const messagesFile = await fs.readFile(localePath, "utf8");
  const messages = JSON.parse(messagesFile);

  return {
    locale,
    messages,
  };
});
