import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CarForm } from "@/components/admin/car-form";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminNewCarPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-3xl font-bold">Add car</h1>
      <CarForm locale={locale} />
    </div>
  );
}
