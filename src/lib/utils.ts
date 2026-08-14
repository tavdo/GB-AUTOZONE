import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CurrencyCode, I18nText, Locale } from "@/types/catalog";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function tText(text: I18nText, locale: Locale): string {
  return text[locale] || text.ka || text.en || "";
}

export function formatPrice(
  amount: number,
  currency: CurrencyCode,
  locale: Locale,
): string {
  const localeTag = locale === "ka" ? "ka-GE" : locale === "ru" ? "ru-RU" : "en-US";
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMileage(km: number, locale: Locale): string {
  const localeTag = locale === "ka" ? "ka-GE" : locale === "ru" ? "ru-RU" : "en-US";
  return `${new Intl.NumberFormat(localeTag).format(km)} km`;
}

export function slugLabel(value: string): string {
  return value.replace(/_/g, " ");
}
