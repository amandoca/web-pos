import type { Order } from "../../domain/order/order.types";

export const ordersMock: Order[] = [
  {
    id: 1,
    userId: 2,
    paymentMethodName: "cash",
    status: "completed",
    subtotal: 57.2,
    fee: 3.43,
    total: 60.63,
    canceledBy: null,
    canceledAt: null,
    createdAt: "2026-03-23T00:00:00.000Z",
    updatedAt: "2026-03-23T00:00:00.000Z",
    items: [
      {
        id: 1,
        productId: 6,
        productTitle: "Shake de Abacate",
        sizeName: "medium",
        unitPrice: 19.4,
        quantity: 1,
        totalPrice: 19.4,
        addons: [
          {
            addonId: 4,
            addonName: "whipped_cream",
            addonPrice: 2.5,
          },
        ],
      },
      {
        id: 2,
        productId: 9,
        productTitle: "Panqueca",
        sizeName: null,
        unitPrice: 18.9,
        quantity: 2,
        totalPrice: 37.8,
        addons: [],
      },
    ],
  },
];
