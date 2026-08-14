import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminLoginPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (session?.user?.role === "admin") {
    redirect(`/${locale}/admin`);
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
      <h1 className="font-display text-3xl font-bold">Admin login</h1>
      <p className="mt-2 mb-6 text-sm text-[var(--muted)]">
        Manage cars, parts, orders and inquiries.
      </p>
      <AdminLoginForm locale={locale} />
    </div>
  );
}
