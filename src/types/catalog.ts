export type Locale = "ka" | "en" | "ru";

export type I18nText = Record<Locale, string>;

export type CurrencyCode = "GEL" | "USD";

export type CarStatus = "available" | "reserved" | "sold";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "customs"
  | "delivered"
  | "cancelled";

export type InquiryType = "car" | "part" | "custom";

export type InquiryStatus = "new" | "in_progress" | "quoted" | "closed";

export interface CatalogImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string | null;
  mileage: number;
  price: number;
  currency: CurrencyCode;
  damageType?: string | null;
  auctionSource?: string | null;
  auctionLot?: string | null;
  location?: string | null;
  description: I18nText;
  status: CarStatus;
  featured?: boolean;
  images: CatalogImage[];
  createdAt: string;
  updatedAt?: string;
}

export interface Part {
  id: string;
  sku: string;
  name: I18nText;
  category: string;
  compatibleMakes: string[];
  compatibleModels: string[];
  compatibleYears: number[];
  oemNumber?: string | null;
  price: number;
  currency: CurrencyCode;
  stockQty: number;
  description: I18nText;
  featured?: boolean;
  images: CatalogImage[];
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  itemType: "car" | "part";
  itemId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  currency: CurrencyCode;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface Inquiry {
  id: string;
  type: InquiryType;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  message: string;
  itemId?: string | null;
  status: InquiryStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CarFilters {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  damageType?: string;
  q?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "year_desc" | "mileage_asc";
  page?: number;
  pageSize?: number;
}

export interface PartFilters {
  category?: string;
  make?: string;
  model?: string;
  year?: number;
  oemNumber?: string;
  q?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type CarInput = Omit<Car, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type PartInput = Omit<Part, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};
