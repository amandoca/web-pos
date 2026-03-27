import type { PaymentMethod } from "../../domain/product/product.types";

export const paymentMethodsMock: PaymentMethod[] = [
  { id: 1, name: "cash" },
  { id: 2, name: "debit_card" },
  { id: 3, name: "credit_card" },
  { id: 4, name: "pix" },
];
