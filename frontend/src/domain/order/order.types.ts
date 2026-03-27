import type {
  PaymentMethodName,
  ProductSizeName,
} from "../product/product.types";

export type OrderStatus = "completed" | "canceled";

export interface OrderItemAddonSnapshot {
  addonId: number;
  addonName: string;
  addonPrice: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  sizeName: ProductSizeName | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  addons: OrderItemAddonSnapshot[];
}

export interface Order {
  id: number;
  userId: number;
  paymentMethodName: PaymentMethodName;
  status: OrderStatus;
  subtotal: number;
  fee: number;
  total: number;
  canceledBy: number | null;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
