export type CategoryName =
  | "meats"
  | "hamburgers"
  | "pizzas"
  | "drinks"
  | "desserts"
  | "snacks"
  | "pasta"
  | "salads";

export type PaymentMethodName = "cash" | "debit_card" | "credit_card" | "pix";

export type ProductSizeName = "small" | "medium" | "large";

export interface Category {
  id: number;
  name: CategoryName;
}

export interface PaymentMethod {
  id: number;
  name: PaymentMethodName;
}

export interface Addon {
  id: number;
  name: string;
  price: number;
}

export interface ProductSize {
  id: number;
  productId: number;
  name: ProductSizeName;
  extraPrice: number;
}

export interface Product {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  stock: number;
  isAvailable: boolean;
  hasSizes: boolean;
  addonIds: number[];
}
