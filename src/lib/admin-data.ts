import {
  createId,
  readStore,
  writeStore,
} from "@/lib/store";
import { mapCar, mapInquiry, mapOrder, mapPart } from "@/lib/mappers";
import { getPrisma, isMockDataEnabled } from "@/lib/prisma";
import type {
  Car,
  CarInput,
  Inquiry,
  InquiryStatus,
  Order,
  OrderStatus,
  Part,
  PartInput,
} from "@/types/catalog";

const imageInclude = { images: { orderBy: { sortOrder: "asc" as const } } };

export function listCars(): Car[] {
  if (isMockDataEnabled()) return readStore().cars;
  throw new Error("Use listCarsAsync with Turso enabled");
}

export async function listCarsAsync(): Promise<Car[]> {
  if (isMockDataEnabled()) return readStore().cars;
  const rows = await getPrisma().car.findMany({
    include: imageInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapCar);
}

export function getCar(id: string): Car | undefined {
  if (isMockDataEnabled()) return readStore().cars.find((c) => c.id === id);
  return undefined;
}

export async function getCarAsync(id: string): Promise<Car | null> {
  if (isMockDataEnabled()) return readStore().cars.find((c) => c.id === id) ?? null;
  const row = await getPrisma().car.findUnique({
    where: { id },
    include: imageInclude,
  });
  return row ? mapCar(row) : null;
}

export function createCar(input: CarInput): Car {
  if (!isMockDataEnabled()) {
    throw new Error("Use createCarAsync with Turso enabled");
  }
  const store = readStore();
  const now = new Date().toISOString();
  const car: Car = {
    ...input,
    id: input.id || createId("car"),
    createdAt: now,
    updatedAt: now,
  };
  store.cars.unshift(car);
  writeStore(store);
  return car;
}

export async function createCarAsync(input: CarInput): Promise<Car> {
  if (isMockDataEnabled()) return createCar(input);
  const id = input.id || createId("car");
  const row = await getPrisma().car.create({
    data: {
      id,
      make: input.make,
      model: input.model,
      year: input.year,
      vin: input.vin || null,
      mileage: input.mileage,
      price: input.price,
      currency: input.currency,
      damageType: input.damageType || null,
      auctionSource: input.auctionSource || null,
      auctionLot: input.auctionLot || null,
      location: input.location || null,
      description: input.description,
      status: input.status,
      featured: Boolean(input.featured),
      images: {
        create: (input.images ?? []).map((img, i) => ({
          id: img.id || createId("img"),
          url: img.url,
          alt: img.alt ?? null,
          sortOrder: img.sortOrder ?? i,
          ownerType: "car",
        })),
      },
    },
    include: imageInclude,
  });
  return mapCar(row);
}

export function updateCar(id: string, input: Partial<CarInput>): Car | null {
  if (!isMockDataEnabled()) return null;
  const store = readStore();
  const idx = store.cars.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated: Car = {
    ...store.cars[idx],
    ...input,
    id,
    createdAt: store.cars[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  store.cars[idx] = updated;
  writeStore(store);
  return updated;
}

export async function updateCarAsync(
  id: string,
  input: Partial<CarInput>,
): Promise<Car | null> {
  if (isMockDataEnabled()) return updateCar(id, input);
  const existing = await getPrisma().car.findUnique({ where: { id } });
  if (!existing) return null;

  if (input.images) {
    await getPrisma().image.deleteMany({ where: { carId: id } });
  }

  const row = await getPrisma().car.update({
    where: { id },
    data: {
      make: input.make,
      model: input.model,
      year: input.year,
      vin: input.vin === undefined ? undefined : input.vin || null,
      mileage: input.mileage,
      price: input.price,
      currency: input.currency,
      damageType: input.damageType === undefined ? undefined : input.damageType || null,
      auctionSource:
        input.auctionSource === undefined ? undefined : input.auctionSource || null,
      auctionLot: input.auctionLot === undefined ? undefined : input.auctionLot || null,
      location: input.location === undefined ? undefined : input.location || null,
      description: input.description,
      status: input.status,
      featured: input.featured,
      ...(input.images
        ? {
            images: {
              create: input.images.map((img, i) => ({
                id: img.id || createId("img"),
                url: img.url,
                alt: img.alt ?? null,
                sortOrder: img.sortOrder ?? i,
                ownerType: "car" as const,
              })),
            },
          }
        : {}),
    },
    include: imageInclude,
  });
  return mapCar(row);
}

export function deleteCar(id: string): boolean {
  if (!isMockDataEnabled()) return false;
  const store = readStore();
  const before = store.cars.length;
  store.cars = store.cars.filter((c) => c.id !== id);
  if (store.cars.length === before) return false;
  writeStore(store);
  return true;
}

export async function deleteCarAsync(id: string): Promise<boolean> {
  if (isMockDataEnabled()) return deleteCar(id);
  try {
    await getPrisma().car.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export function listParts(): Part[] {
  if (isMockDataEnabled()) return readStore().parts;
  throw new Error("Use listPartsAsync with Turso enabled");
}

export async function listPartsAsync(): Promise<Part[]> {
  if (isMockDataEnabled()) return readStore().parts;
  const rows = await getPrisma().part.findMany({
    include: imageInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapPart);
}

export function getPart(id: string): Part | undefined {
  if (isMockDataEnabled()) return readStore().parts.find((p) => p.id === id);
  return undefined;
}

export async function getPartAsync(id: string): Promise<Part | null> {
  if (isMockDataEnabled()) return readStore().parts.find((p) => p.id === id) ?? null;
  const row = await getPrisma().part.findUnique({
    where: { id },
    include: imageInclude,
  });
  return row ? mapPart(row) : null;
}

export function createPart(input: PartInput): Part {
  if (!isMockDataEnabled()) throw new Error("Use createPartAsync");
  const store = readStore();
  const now = new Date().toISOString();
  const part: Part = {
    ...input,
    id: input.id || createId("part"),
    createdAt: now,
    updatedAt: now,
  };
  store.parts.unshift(part);
  writeStore(store);
  return part;
}

export async function createPartAsync(input: PartInput): Promise<Part> {
  if (isMockDataEnabled()) return createPart(input);
  const id = input.id || createId("part");
  const row = await getPrisma().part.create({
    data: {
      id,
      sku: input.sku,
      name: input.name,
      category: input.category,
      compatibleMakes: input.compatibleMakes,
      compatibleModels: input.compatibleModels,
      compatibleYears: input.compatibleYears,
      oemNumber: input.oemNumber || null,
      price: input.price,
      currency: input.currency,
      stockQty: input.stockQty,
      description: input.description,
      featured: Boolean(input.featured),
      images: {
        create: (input.images ?? []).map((img, i) => ({
          id: img.id || createId("img"),
          url: img.url,
          alt: img.alt ?? null,
          sortOrder: img.sortOrder ?? i,
          ownerType: "part",
        })),
      },
    },
    include: imageInclude,
  });
  return mapPart(row);
}

export function updatePart(id: string, input: Partial<PartInput>): Part | null {
  if (!isMockDataEnabled()) return null;
  const store = readStore();
  const idx = store.parts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated: Part = {
    ...store.parts[idx],
    ...input,
    id,
    createdAt: store.parts[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  store.parts[idx] = updated;
  writeStore(store);
  return updated;
}

export async function updatePartAsync(
  id: string,
  input: Partial<PartInput>,
): Promise<Part | null> {
  if (isMockDataEnabled()) return updatePart(id, input);
  const existing = await getPrisma().part.findUnique({ where: { id } });
  if (!existing) return null;
  if (input.images) {
    await getPrisma().image.deleteMany({ where: { partId: id } });
  }
  const row = await getPrisma().part.update({
    where: { id },
    data: {
      sku: input.sku,
      name: input.name,
      category: input.category,
      compatibleMakes: input.compatibleMakes,
      compatibleModels: input.compatibleModels,
      compatibleYears: input.compatibleYears,
      oemNumber: input.oemNumber === undefined ? undefined : input.oemNumber || null,
      price: input.price,
      currency: input.currency,
      stockQty: input.stockQty,
      description: input.description,
      featured: input.featured,
      ...(input.images
        ? {
            images: {
              create: input.images.map((img, i) => ({
                id: img.id || createId("img"),
                url: img.url,
                alt: img.alt ?? null,
                sortOrder: img.sortOrder ?? i,
                ownerType: "part" as const,
              })),
            },
          }
        : {}),
    },
    include: imageInclude,
  });
  return mapPart(row);
}

export function deletePart(id: string): boolean {
  if (!isMockDataEnabled()) return false;
  const store = readStore();
  const before = store.parts.length;
  store.parts = store.parts.filter((p) => p.id !== id);
  if (store.parts.length === before) return false;
  writeStore(store);
  return true;
}

export async function deletePartAsync(id: string): Promise<boolean> {
  if (isMockDataEnabled()) return deletePart(id);
  try {
    await getPrisma().part.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export function listOrders(): Order[] {
  if (isMockDataEnabled()) {
    return [...readStore().orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  throw new Error("Use listOrdersAsync");
}

export async function listOrdersAsync(): Promise<Order[]> {
  if (isMockDataEnabled()) return listOrders();
  const rows = await getPrisma().order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapOrder);
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  if (!isMockDataEnabled()) return null;
  const store = readStore();
  const idx = store.orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  store.orders[idx] = {
    ...store.orders[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  return store.orders[idx];
}

export async function updateOrderStatusAsync(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  if (isMockDataEnabled()) return updateOrderStatus(id, status);
  try {
    const row = await getPrisma().order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    return mapOrder(row);
  } catch {
    return null;
  }
}

export function deleteOrder(id: string): boolean {
  if (!isMockDataEnabled()) return false;
  const store = readStore();
  const before = store.orders.length;
  store.orders = store.orders.filter((o) => o.id !== id);
  if (store.orders.length === before) return false;
  writeStore(store);
  return true;
}

export async function deleteOrderAsync(id: string): Promise<boolean> {
  if (isMockDataEnabled()) return deleteOrder(id);
  try {
    await getPrisma().order.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export function listInquiries(): Inquiry[] {
  if (isMockDataEnabled()) {
    return [...readStore().inquiries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  throw new Error("Use listInquiriesAsync");
}

export async function listInquiriesAsync(): Promise<Inquiry[]> {
  if (isMockDataEnabled()) return listInquiries();
  const rows = await getPrisma().inquiryRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapInquiry);
}

export function createInquiry(
  input: Omit<Inquiry, "id" | "createdAt" | "updatedAt" | "status"> & {
    status?: Inquiry["status"];
  },
): Inquiry {
  if (!isMockDataEnabled()) throw new Error("Use createInquiryAsync");
  const store = readStore();
  const inquiry: Inquiry = {
    ...input,
    id: createId("inq"),
    status: input.status ?? "new",
    createdAt: new Date().toISOString(),
  };
  store.inquiries.unshift(inquiry);
  writeStore(store);
  return inquiry;
}

export async function createInquiryAsync(
  input: Omit<Inquiry, "id" | "createdAt" | "updatedAt" | "status"> & {
    status?: Inquiry["status"];
  },
): Promise<Inquiry> {
  if (isMockDataEnabled()) return createInquiry(input);
  const row = await getPrisma().inquiryRequest.create({
    data: {
      type: input.type,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone || null,
      message: input.message,
      details: input.itemId ? { itemId: input.itemId } : undefined,
      status: input.status ?? "new",
    },
  });
  return mapInquiry(row);
}

export function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Inquiry | null {
  if (!isMockDataEnabled()) return null;
  const store = readStore();
  const idx = store.inquiries.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  store.inquiries[idx] = {
    ...store.inquiries[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  return store.inquiries[idx];
}

export async function updateInquiryStatusAsync(
  id: string,
  status: InquiryStatus,
): Promise<Inquiry | null> {
  if (isMockDataEnabled()) return updateInquiryStatus(id, status);
  try {
    const row = await getPrisma().inquiryRequest.update({
      where: { id },
      data: { status },
    });
    return mapInquiry(row);
  } catch {
    return null;
  }
}

export function deleteInquiry(id: string): boolean {
  if (!isMockDataEnabled()) return false;
  const store = readStore();
  const before = store.inquiries.length;
  store.inquiries = store.inquiries.filter((i) => i.id !== id);
  if (store.inquiries.length === before) return false;
  writeStore(store);
  return true;
}

export async function deleteInquiryAsync(id: string): Promise<boolean> {
  if (isMockDataEnabled()) return deleteInquiry(id);
  try {
    await getPrisma().inquiryRequest.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export function getDashboardStats() {
  if (isMockDataEnabled()) {
    const store = readStore();
    return {
      cars: store.cars.length,
      parts: store.parts.length,
      orders: store.orders.length,
      inquiriesNew: store.inquiries.filter((i) => i.status === "new").length,
      carsAvailable: store.cars.filter((c) => c.status === "available").length,
      partsInStock: store.parts.filter((p) => p.stockQty > 0).length,
    };
  }
  throw new Error("Use getDashboardStatsAsync");
}

export async function getDashboardStatsAsync() {
  if (isMockDataEnabled()) return getDashboardStats();
  const db = getPrisma();
  const [cars, parts, orders, inquiriesNew, carsAvailable, partsInStock] =
    await Promise.all([
      db.car.count(),
      db.part.count(),
      db.order.count(),
      db.inquiryRequest.count({ where: { status: "new" } }),
      db.car.count({ where: { status: "available" } }),
      db.part.count({ where: { stockQty: { gt: 0 } } }),
    ]);
  return { cars, parts, orders, inquiriesNew, carsAvailable, partsInStock };
}
