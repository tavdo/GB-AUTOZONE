import { listCarsAsync, listPartsAsync } from "@/lib/admin-data";
import type {
  Car,
  CarFilters,
  PaginatedResult,
  Part,
  PartFilters,
} from "@/types/catalog";

function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 12,
): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return {
    items: slice,
    total: items.length,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

export async function getCars(
  filters: CarFilters = {},
): Promise<PaginatedResult<Car>> {
  let result = await listCarsAsync();

  if (filters.make) {
    const make = filters.make.toLowerCase();
    result = result.filter((c) => c.make.toLowerCase() === make);
  }
  if (filters.model) {
    const model = filters.model.toLowerCase();
    result = result.filter((c) => c.model.toLowerCase().includes(model));
  }
  if (filters.yearMin) {
    result = result.filter((c) => c.year >= filters.yearMin!);
  }
  if (filters.yearMax) {
    result = result.filter((c) => c.year <= filters.yearMax!);
  }
  if (filters.priceMin) {
    result = result.filter((c) => c.price >= filters.priceMin!);
  }
  if (filters.priceMax) {
    result = result.filter((c) => c.price <= filters.priceMax!);
  }
  if (filters.mileageMax) {
    result = result.filter((c) => c.mileage <= filters.mileageMax!);
  }
  if (filters.damageType) {
    result = result.filter((c) => c.damageType === filters.damageType);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (c) =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.vin?.toLowerCase().includes(q) ||
        c.auctionLot?.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "year_desc":
      result.sort((a, b) => b.year - a.year);
      break;
    case "mileage_asc":
      result.sort((a, b) => a.mileage - b.mileage);
      break;
    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  return paginate(result, filters.page, filters.pageSize ?? 12);
}

export async function getCarById(id: string): Promise<Car | null> {
  const { getCarAsync } = await import("@/lib/admin-data");
  return getCarAsync(id);
}

export async function getFeaturedCars(limit = 4): Promise<Car[]> {
  const cars = await listCarsAsync();
  return cars
    .filter((c) => c.featured && c.status === "available")
    .slice(0, limit);
}

export async function getCarMakes(): Promise<string[]> {
  const cars = await listCarsAsync();
  return [...new Set(cars.map((c) => c.make))].sort();
}

export async function getParts(
  filters: PartFilters = {},
): Promise<PaginatedResult<Part>> {
  let result = await listPartsAsync();

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.make) {
    const make = filters.make.toLowerCase();
    result = result.filter((p) =>
      p.compatibleMakes.some((m) => m.toLowerCase() === make),
    );
  }
  if (filters.model) {
    const model = filters.model.toLowerCase();
    result = result.filter((p) =>
      p.compatibleModels.some((m) => m.toLowerCase().includes(model)),
    );
  }
  if (filters.year) {
    result = result.filter((p) => p.compatibleYears.includes(filters.year!));
  }
  if (filters.oemNumber) {
    const oem = filters.oemNumber.toLowerCase();
    result = result.filter((p) => p.oemNumber?.toLowerCase().includes(oem));
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.sku.toLowerCase().includes(q) ||
        p.oemNumber?.toLowerCase().includes(q) ||
        Object.values(p.name).some((n) => n.toLowerCase().includes(q)) ||
        p.compatibleMakes.some((m) => m.toLowerCase().includes(q)),
    );
  }

  switch (filters.sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  return paginate(result, filters.page, filters.pageSize ?? 12);
}

export async function getPartById(id: string): Promise<Part | null> {
  const { getPartAsync } = await import("@/lib/admin-data");
  return getPartAsync(id);
}

export async function getFeaturedParts(limit = 4): Promise<Part[]> {
  const parts = await listPartsAsync();
  return parts.filter((p) => p.featured).slice(0, limit);
}

export async function getPartMakes(): Promise<string[]> {
  const parts = await listPartsAsync();
  return [...new Set(parts.flatMap((p) => p.compatibleMakes))].sort();
}
