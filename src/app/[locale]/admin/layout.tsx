import { auth } from "@/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { AuthProvider } from "@/components/providers/auth-provider";

export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  return (
    <AuthProvider>
      {isAdmin ? (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
          <AdminNav locale={locale} />
          <div className="flex-1 p-4 md:p-8">{children}</div>
        </div>
      ) : (
        <div className="section-pad">
          <div className="container-page max-w-md">{children}</div>
        </div>
      )}
    </AuthProvider>
  );
}
