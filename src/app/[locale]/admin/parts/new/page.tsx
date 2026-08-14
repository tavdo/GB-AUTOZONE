import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PartForm } from "@/components/admin/part-form";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminNewPartPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-3xl font-bold">Add part</h1>
      <PartForm locale={locale} />
    </div>
  );
}
