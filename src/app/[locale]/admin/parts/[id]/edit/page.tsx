import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { PartForm } from "@/components/admin/part-form";
import { getPartAsync } from "@/lib/admin-data";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function AdminEditPartPage({ params }: Props) {
  const { locale, id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/admin/login`);
  }

  const part = await getPartAsync(id);
  if (!part) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-3xl font-bold">Edit part</h1>
      <PartForm locale={locale} initial={part} />
    </div>
  );
}
