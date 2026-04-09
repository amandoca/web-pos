import {
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  writeBatch,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { getFirebaseFirestore } from "../../application/firebase";
import type {
  PaymentMethodName,
  ProductSizeName,
} from "../../domain/product/product.types";
import type {
  Order,
  OrderItem,
  OrderItemAddonSnapshot,
} from "../../domain/order/order.types";

function getOrdersCollectionReference() {
  return collection(getFirebaseFirestore(), "orders");
}

function getOrderDocumentReference(orderId: number) {
  return doc(getFirebaseFirestore(), "orders", String(orderId));
}

function isPaymentMethodName(value: unknown): value is PaymentMethodName {
  return (
    value === "cash" ||
    value === "debit_card" ||
    value === "credit_card" ||
    value === "pix"
  );
}

function isProductSizeName(value: unknown): value is ProductSizeName {
  return value === "small" || value === "medium" || value === "large";
}

function mapFirestoreDate(value: unknown): string | null {
  if (value === null) {
    return null;
  }

  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
}

function isNullableFirestoreDate(value: unknown): boolean {
  return value === null || mapFirestoreDate(value) !== null;
}

function createFirestoreTimestamp(value: string | null): Timestamp | null {
  if (!value) {
    return null;
  }

  return Timestamp.fromDate(new Date(value));
}

function mapOrderItemAddonSnapshot(
  addonSnapshot: unknown,
): OrderItemAddonSnapshot | null {
  if (
    !addonSnapshot ||
    typeof addonSnapshot !== "object" ||
    typeof (addonSnapshot as Record<string, unknown>).addonId !== "number" ||
    typeof (addonSnapshot as Record<string, unknown>).addonName !== "string" ||
    typeof (addonSnapshot as Record<string, unknown>).addonPrice !== "number"
  ) {
    return null;
  }

  const addonData = addonSnapshot as {
    addonId: number;
    addonName: string;
    addonPrice: number;
  };

  return {
    addonId: addonData.addonId,
    addonName: addonData.addonName,
    addonPrice: addonData.addonPrice,
  };
}

function mapOrderItem(orderItem: unknown): OrderItem | null {
  if (!orderItem || typeof orderItem !== "object") {
    return null;
  }

  const orderItemData = orderItem as Record<string, unknown>;
  const sizeName = orderItemData.sizeName;

  if (
    typeof orderItemData.id !== "number" ||
    typeof orderItemData.productId !== "number" ||
    typeof orderItemData.productTitle !== "string" ||
    (sizeName !== null && !isProductSizeName(sizeName)) ||
    typeof orderItemData.unitPrice !== "number" ||
    typeof orderItemData.quantity !== "number" ||
    typeof orderItemData.totalPrice !== "number"
  ) {
    return null;
  }

  const addons = Array.isArray(orderItemData.addons)
    ? orderItemData.addons
        .map(function mapAddonSnapshot(addonSnapshot) {
          return mapOrderItemAddonSnapshot(addonSnapshot);
        })
        .filter(function filterAddonSnapshot(
          addonSnapshot,
        ): addonSnapshot is OrderItemAddonSnapshot {
          return addonSnapshot !== null;
        })
    : [];

  return {
    addons,
    id: orderItemData.id,
    productId: orderItemData.productId,
    productTitle: orderItemData.productTitle,
    quantity: orderItemData.quantity,
    sizeName: sizeName ?? null,
    totalPrice: orderItemData.totalPrice,
    unitPrice: orderItemData.unitPrice,
  };
}

function mapOrderDocument(
  orderDocument: QueryDocumentSnapshot<DocumentData>,
): Order | null {
  return mapOrderDocumentData(orderDocument.id, orderDocument.data());
}

function mapOrderDocumentSnapshot(
  orderDocument: DocumentSnapshot<DocumentData>,
): Order | null {
  if (!orderDocument.exists()) {
    return null;
  }

  return mapOrderDocumentData(orderDocument.id, orderDocument.data());
}

function mapOrderDocumentData(
  documentId: string,
  data: DocumentData,
): Order | null {
  const parsedId = Number(documentId);
  const orderId = typeof data.id === "number" ? data.id : parsedId;

  if (
    !Number.isFinite(orderId) ||
    typeof data.userId !== "number" ||
    !isPaymentMethodName(data.paymentMethodName) ||
    (data.status !== "completed" && data.status !== "canceled") ||
    typeof data.subtotal !== "number" ||
    typeof data.fee !== "number" ||
    typeof data.total !== "number" ||
    (data.canceledBy !== null && typeof data.canceledBy !== "number") ||
    !isNullableFirestoreDate(data.canceledAt) ||
    mapFirestoreDate(data.createdAt) === null ||
    mapFirestoreDate(data.updatedAt) === null ||
    !Array.isArray(data.items)
  ) {
    return null;
  }

  const items = data.items
    .map(function mapOrderSnapshotItem(orderItem) {
      return mapOrderItem(orderItem);
    })
    .filter(function filterOrderItem(orderItem): orderItem is OrderItem {
      return orderItem !== null;
    });

  return {
    canceledAt: mapFirestoreDate(data.canceledAt),
    canceledBy: data.canceledBy,
    createdAt: mapFirestoreDate(data.createdAt) ?? new Date().toISOString(),
    fee: data.fee,
    id: orderId,
    items,
    paymentMethodName: data.paymentMethodName,
    status: data.status,
    subtotal: data.subtotal,
    total: data.total,
    updatedAt: mapFirestoreDate(data.updatedAt) ?? new Date().toISOString(),
    userId: data.userId,
  };
}

function buildOrderDocument(order: Order) {
  return {
    canceledAt: createFirestoreTimestamp(order.canceledAt),
    canceledBy: order.canceledBy,
    createdAt: createFirestoreTimestamp(order.createdAt),
    fee: order.fee,
    id: order.id,
    items: order.items,
    paymentMethodName: order.paymentMethodName,
    status: order.status,
    subtotal: order.subtotal,
    total: order.total,
    updatedAt: createFirestoreTimestamp(order.updatedAt),
    userId: order.userId,
  };
}

// Lê todos os pedidos salvos no Firestore.
export async function getOrders(): Promise<Order[]> {
  const orderCollectionSnapshot = await getDocs(getOrdersCollectionReference());
  const orders = orderCollectionSnapshot.docs
    .map(function mapOrder(orderDocument) {
      return mapOrderDocument(orderDocument);
    })
    .filter(function filterOrder(order): order is Order {
      return order !== null;
    });

  return orders.sort(function sortOrders(leftOrder, rightOrder) {
    return rightOrder.id - leftOrder.id;
  });
}

// Salva a lista completa de pedidos no Firestore.
export async function saveOrders(orders: Order[]): Promise<Order[]> {
  const firestore = getFirebaseFirestore();
  const writeOperation = writeBatch(firestore);

  for (const order of orders) {
    writeOperation.set(
      getOrderDocumentReference(order.id),
      buildOrderDocument(order),
      { merge: true },
    );
  }

  await writeOperation.commit();

  return orders;
}

// Procura um pedido específico pelo id.
export async function getOrderById(orderId: number): Promise<Order | null> {
  const orderDocumentSnapshot = await getDoc(getOrderDocumentReference(orderId));

  return mapOrderDocumentSnapshot(orderDocumentSnapshot);
}

// Filtra apenas os pedidos de um usuário.
export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const orders = await getOrders();

  return orders.filter(function filterOrdersByUser(order) {
    return order.userId === userId;
  });
}
