import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/admin-data";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/admin/login`);
  }

  const stats = getDashboardStats();

  const cards = [
    { label: "Cars", value: stats.cars, href: `/${locale}/admin/cars`, hint: `${stats.carsAvailable} available` },
    { label: "Parts", value: stats.parts, href: `/${locale}/admin/parts`, hint: `${stats.partsInStock} in stock` },
    { label: "Orders", value: stats.orders, href: `/${locale}/admin/orders`, hint: "Manage status" },
    { label: "New inquiries", value: stats.inquiriesNew, href: `/${locale}/admin/inquiries`, hint: "Needs reply" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Signed in as {session.user.email}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
          >
            <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
              {card.label}
            </p>
            <p className="mt-2 font-display text-4xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{card.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
