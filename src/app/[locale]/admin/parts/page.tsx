import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { listPartsAsync } from "@/lib/admin-data";
import { formatPrice, tText } from "@/lib/utils";
import type { Locale } from "@/types/catalog";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPartsPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/admin/login`);
  }

  const parts = await listPartsAsync();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Parts</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/parts/new`}>+ Add part</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Part</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  <p className="font-semibold">
                    {tText(part.name, locale as Locale)}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{part.category}</p>
                </td>
                <td className="px-4 py-3">{part.sku}</td>
                <td className="px-4 py-3">{part.stockQty}</td>
                <td className="px-4 py-3">
                  {formatPrice(part.price, part.currency, locale as Locale)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/${locale}/admin/parts/${part.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <DeleteButton endpoint={`/api/admin/parts/${part.id}`} />
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
