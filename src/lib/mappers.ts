import type {
  Car,
  CatalogImage,
  I18nText,
  Inquiry,
  Order,
  OrderItem,
  Part,
} from "@/types/catalog";

type DbImage = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

type DbCar = {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string | null;
  mileage: number;
  price: number;
  currency: string;
  damageType: string | null;
  auctionSource: string | null;
  auctionLot: string | null;
  location: string | null;
  description: unknown;
  status: string;
  featured: boolean;
  createdAt: Date;
  updatedAt?: Date;
  images?: DbImage[];
};

type DbPart = {
  id: string;
  sku: string;
  name: unknown;
  category: string;
  compatibleMakes: unknown;
  compatibleModels: unknown;
  compatibleYears: unknown;
  oemNumber: string | null;
  price: number;
  currency: string;
  stockQty: number;
  description: unknown;
  featured: boolean;
  createdAt: Date;
  updatedAt?: Date;
  images?: DbImage[];
};

function asI18n(value: unknown): I18nText {
  const v = (value ?? {}) as Partial<I18nText>;
  return {
    ka: v.ka ?? "",
    en: v.en ?? "",
    ru: v.ru ?? "",
  };
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

function asNumberArray(value: unknown): number[] {
  if (Array.isArray(value)) return value.map(Number).filter((n) => !Number.isNaN(n));
  return [];
}

function mapImages(images?: DbImage[]): CatalogImage[] {
  return (images ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? undefined,
      sortOrder: img.sortOrder,
    }));
}

export function mapCar(row: DbCar): Car {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    vin: row.vin,
    mileage: row.mileage,
    price: row.price,
    currency: row.currency === "GEL" ? "GEL" : "USD",
    damageType: row.damageType,
    auctionSource: row.auctionSource,
    auctionLot: row.auctionLot,
    location: row.location,
    description: asI18n(row.description),
    status: row.status as Car["status"],
    featured: row.featured,
    images: mapImages(row.images),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export function mapPart(row: DbPart): Part {
  return {
    id: row.id,
    sku: row.sku,
    name: asI18n(row.name),
    category: row.category,
    compatibleMakes: asStringArray(row.compatibleMakes),
    compatibleModels: asStringArray(row.compatibleModels),
    compatibleYears: asNumberArray(row.compatibleYears),
    oemNumber: row.oemNumber,
    price: row.price,
    currency: row.currency === "GEL" ? "GEL" : "USD",
    stockQty: row.stockQty,
    description: asI18n(row.description),
    featured: row.featured,
    images: mapImages(row.images),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export function mapOrder(row: {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  items: {
    id: string;
    itemType: string;
    itemId: string;
    title: string;
    quantity: number;
    unitPrice: number;
  }[];
}): Order {
  return {
    id: row.id,
    status: row.status as Order["status"],
    totalAmount: row.totalAmount,
    currency: row.currency === "GEL" ? "GEL" : "USD",
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone,
    notes: row.notes,
    items: row.items.map(
      (i): OrderItem => ({
        id: i.id,
        itemType: i.itemType as OrderItem["itemType"],
        itemId: i.itemId,
        title: i.title,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      }),
    ),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export function mapInquiry(row: {
  id: string;
  type: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  message: string;
  details: unknown;
  status: string;
  createdAt: Date;
  updatedAt?: Date | null;
}): Inquiry {
  const details = (row.details ?? {}) as { itemId?: string };
  return {
    id: row.id,
    type: row.type as Inquiry["type"],
    contactName: row.contactName,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    message: row.message,
    itemId: details.itemId ?? null,
    status: row.status as Inquiry["status"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
