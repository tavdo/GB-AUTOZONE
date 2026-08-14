"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Car,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "cars", label: "Cars", icon: Car },
  { href: "parts", label: "Parts", icon: Package },
  { href: "orders", label: "Orders", icon: ShoppingBag },
  { href: "inquiries", label: "Inquiries", icon: MessageSquare },
] as const;

export function AdminNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const base = `/${locale}/admin`;

  return (
    <aside className="flex w-full flex-col border-b border-[var(--border)] bg-[var(--surface)] lg:w-56 lg:border-r lg:border-b-0">
      <div className="border-b border-[var(--border)] px-4 py-4">
        <Link href={base} className="font-display text-xl font-bold">
          Admin
        </Link>
        <p className="text-xs text-[var(--muted)]">GB Autozone</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col">
        {links.map((link) => {
          const href =
            link.href === "dashboard" ? base : `${base}/${link.href}`;
          const active =
            link.href === "dashboard"
              ? pathname === base || pathname === `${base}/`
              : pathname.startsWith(href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition",
                active
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "text-[var(--muted)] hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-2">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
          className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--muted)] hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
        <Link
          href={`/${locale}`}
          className="mt-1 block px-3 py-2 text-xs text-[var(--muted)] hover:text-white"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
