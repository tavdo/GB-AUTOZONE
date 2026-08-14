import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { CarForm } from "@/components/admin/car-form";
import { getCar } from "@/lib/admin-data";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function AdminEditCarPage({ params }: Props) {
  const { locale, id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/admin/login`);
  }

  const car = getCar(id);
  if (!car) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-3xl font-bold">
        Edit: {car.year} {car.make} {car.model}
      </h1>
      <CarForm locale={locale} initial={car} />
    </div>
  );
}
