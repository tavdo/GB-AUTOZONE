import { createId, readStore, writeStore } from "@/lib/store";
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

export function listCars(): Car[] {
  return readStore().cars;
}

export function getCar(id: string): Car | undefined {
  return readStore().cars.find((c) => c.id === id);
}

export function createCar(input: CarInput): Car {
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

export function updateCar(id: string, input: Partial<CarInput>): Car | null {
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

export function deleteCar(id: string): boolean {
  const store = readStore();
  const before = store.cars.length;
  store.cars = store.cars.filter((c) => c.id !== id);
  if (store.cars.length === before) return false;
  writeStore(store);
  return true;
}

export function listParts(): Part[] {
  return readStore().parts;
}

export function getPart(id: string): Part | undefined {
  return readStore().parts.find((p) => p.id === id);
}

export function createPart(input: PartInput): Part {
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

export function updatePart(id: string, input: Partial<PartInput>): Part | null {
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

export function deletePart(id: string): boolean {
  const store = readStore();
  const before = store.parts.length;
  store.parts = store.parts.filter((p) => p.id !== id);
  if (store.parts.length === before) return false;
  writeStore(store);
  return true;
}

export function listOrders(): Order[] {
  return [...readStore().orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Order | null {
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

export function deleteOrder(id: string): boolean {
  const store = readStore();
  const before = store.orders.length;
  store.orders = store.orders.filter((o) => o.id !== id);
  if (store.orders.length === before) return false;
  writeStore(store);
  return true;
}

export function listInquiries(): Inquiry[] {
  return [...readStore().inquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function createInquiry(
  input: Omit<Inquiry, "id" | "createdAt" | "updatedAt" | "status"> & {
    status?: Inquiry["status"];
  },
): Inquiry {
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

export function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Inquiry | null {
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

export function deleteInquiry(id: string): boolean {
  const store = readStore();
  const before = store.inquiries.length;
  store.inquiries = store.inquiries.filter((i) => i.id !== id);
  if (store.inquiries.length === before) return false;
  writeStore(store);
  return true;
}

export function getDashboardStats() {
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
