"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function ChatFloat() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "995555000000";
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "gbautozone";

  if (pathname.includes("/admin")) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-[#052e16] shadow-lg transition hover:brightness-110"
      >
        <MessageCircle className="h-4 w-4" />
        {t("whatsapp")}
      </a>
      <a
        href={`https://t.me/${telegram}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-12 items-center gap-2 rounded-full bg-[#2AABEE] px-4 text-sm font-semibold text-[#031525] shadow-lg transition hover:brightness-110"
      >
        <MessageCircle className="h-4 w-4" />
        {t("telegram")}
      </a>
    </div>
  );
}
