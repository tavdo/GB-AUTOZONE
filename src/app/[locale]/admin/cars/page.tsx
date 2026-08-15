import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { listCarsAsync } from "@/lib/admin-data";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/types/catalog";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminCarsPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/admin/login`);
  }

  const cars = await listCarsAsync();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Cars</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/cars/new`}>+ Add car</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Lot</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  <p className="font-semibold">
                    {car.year} {car.make} {car.model}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{car.id}</p>
                </td>
                <td className="px-4 py-3">{car.status}</td>
                <td className="px-4 py-3">
                  {formatPrice(car.price, car.currency, locale as Locale)}
                </td>
                <td className="px-4 py-3">{car.auctionLot || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/${locale}/admin/cars/${car.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <DeleteButton endpoint={`/api/admin/cars/${car.id}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
