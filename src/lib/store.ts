import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { cars as seedCars } from "@/lib/data/cars";
import { parts as seedParts } from "@/lib/data/parts";
import type { Car, Inquiry, Order, Part } from "@/types/catalog";

export interface DataStore {
  cars: Car[];
  parts: Part[];
  orders: Order[];
  inquiries: Inquiry[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

const globalStore = globalThis as unknown as {
  __gbStore?: DataStore;
  __gbStoreFileOk?: boolean;
};

function seedOrders(): Order[] {
  return [
    {
      id: "ord-demo-1",
      status: "processing",
      totalAmount: 1100,
      currency: "USD",
      customerName: "Nika G.",
      customerEmail: "nika@example.com",
      customerPhone: "+995555111222",
      notes: "Brembo kit — pickup in Tbilisi",
      items: [
        {
          id: "oi-1",
          itemType: "part",
          itemId: "part-brembo-kit",
          title: "Charger Brembo Brake Kit",
          quantity: 1,
          unitPrice: 1100,
        },
      ],
      createdAt: "2026-08-08T10:00:00.000Z",
      updatedAt: "2026-08-09T12:00:00.000Z",
    },
  ];
}

function seedInquiries(): Inquiry[] {
  return [
    {
      id: "inq-demo-1",
      type: "car",
      contactName: "Ana M.",
      contactEmail: "ana@example.com",
      contactPhone: "+995555333444",
      message: "Need 2020+ F-150 from Copart, budget ~40k USD",
      status: "new",
      createdAt: "2026-08-10T09:00:00.000Z",
    },
  ];
}

function defaultStore(): DataStore {
  return {
    cars: structuredClone(seedCars),
    parts: structuredClone(seedParts),
    orders: seedOrders(),
    inquiries: seedInquiries(),
  };
}

function loadFromDisk(): DataStore | null {
  try {
    if (!existsSync(STORE_PATH)) return null;
    return JSON.parse(readFileSync(STORE_PATH, "utf8")) as DataStore;
  } catch {
    return null;
  }
}

function saveToDisk(store: DataStore): boolean {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
    globalStore.__gbStoreFileOk = true;
    return true;
  } catch {
    // Vercel / serverless: filesystem is read-only — keep memory only
    globalStore.__gbStoreFileOk = false;
    return false;
  }
}

function ensureStore(): DataStore {
  if (globalStore.__gbStore) return globalStore.__gbStore;

  const fromDisk = loadFromDisk();
  if (fromDisk) {
    globalStore.__gbStore = fromDisk;
    return fromDisk;
  }

  const initial = defaultStore();
  globalStore.__gbStore = initial;
  saveToDisk(initial);
  return initial;
}

export function readStore(): DataStore {
  return ensureStore();
}

export function writeStore(store: DataStore) {
  globalStore.__gbStore = store;
  saveToDisk(store);
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
