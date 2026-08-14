import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { OrdersTable } from "@/components/admin/orders-table";
import { listOrders } from "@/lib/admin-data";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminOrdersPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/admin/login`);
  }

  const orders = listOrders();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
