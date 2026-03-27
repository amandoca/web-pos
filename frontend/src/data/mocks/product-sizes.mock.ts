import type { ProductSize } from "../../domain/product/product.types";

export const productSizesMock: ProductSize[] = [
  { id: 1, productId: 6, name: "small", extraPrice: 0 },
  { id: 2, productId: 6, name: "medium", extraPrice: 2 },
  { id: 3, productId: 6, name: "large", extraPrice: 4 },

  { id: 4, productId: 7, name: "small", extraPrice: 0 },
  { id: 5, productId: 7, name: "medium", extraPrice: 1.5 },
  { id: 6, productId: 7, name: "large", extraPrice: 3 },

  { id: 7, productId: 8, name: "small", extraPrice: 0 },
  { id: 8, productId: 8, name: "medium", extraPrice: 2 },
  { id: 9, productId: 8, name: "large", extraPrice: 4 },
];
