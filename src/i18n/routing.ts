import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ka", "en", "ru"],
  defaultLocale: "ka",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
