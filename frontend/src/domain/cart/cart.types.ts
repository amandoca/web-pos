import type { Addon, ProductSizeName } from "../product/product.types";

export interface CartItem {
  id: string;
  productId: number;
  title: string;
  imageUrl: string;
  stock: number;
  quantity: number;
  sizeName: ProductSizeName | null;
  addons: Addon[];
  unitPrice: number;
  totalPrice: number;
}

export interface CartSummary {
  subtotal: number;
  fee: number;
  feePercentage: number;
  total: number;
}
