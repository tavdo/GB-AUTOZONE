import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { InquiriesTable } from "@/components/admin/inquiries-table";
import { listInquiries } from "@/lib/admin-data";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminInquiriesPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/admin/login`);
  }

  const inquiries = listInquiries();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Inquiries</h1>
      <InquiriesTable inquiries={inquiries} />
    </div>
  );
}
