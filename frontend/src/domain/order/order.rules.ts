import type { CartItem } from "../cart/cart.types";
import type { CartSummary } from "../cart/cart.types";
import type { PaymentMethodName, Product } from "../product/product.types";
import type { Order, OrderItem } from "./order.types";

// Valida se o pedido tem o mínimo necessário para ser finalizado.
export function ensureCheckoutIsValid(
  cartItems: CartItem[],
  paymentMethodName: string | null,
): void {
  if (cartItems.length === 0) {
    throw new Error("Adicione itens ao carrinho.");
  }

  if (!paymentMethodName) {
    throw new Error("Selecione uma forma de pagamento.");
  }
}

// Confere se todos os produtos do carrinho ainda podem ser vendidos.
export function ensureProductsStockForOrder(
  cartItems: CartItem[],
  products: Product[],
): void {
  for (const cartItem of cartItems) {
    const product = products.find((item) => item.id === cartItem.productId);

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    if (!product.isAvailable) {
      throw new Error(`Produto indisponível: ${product.title}.`);
    }

    if (product.stock < cartItem.quantity) {
      throw new Error(`Estoque insuficiente para: ${product.title}.`);
    }
  }
}

// Diminui o estoque dos produtos depois que o pedido é concluído.
export function decreaseProductsStock(
  products: Product[],
  cartItems: CartItem[],
): Product[] {
  return products.map((product) => {
    const cartItem = cartItems.find((item) => item.productId === product.id);

    if (!cartItem) {
      return product;
    }

    const nextStock = product.stock - cartItem.quantity;

    if (nextStock < 0) {
      throw new Error(`Estoque negativo para: ${product.title}.`);
    }

    return {
      ...product,
      stock: nextStock,
      isAvailable: nextStock > 0 ? product.isAvailable : false,
    };
  });
}

// Devolve o estoque dos itens quando um pedido é cancelado.
export function restoreProductsStock(
  products: Product[],
  order: Order,
): Product[] {
  return products.map((product) => {
    const orderItem = order.items.find((item) => item.productId === product.id);

    if (!orderItem) {
      return product;
    }

    const nextStock = product.stock + orderItem.quantity;

    return {
      ...product,
      stock: nextStock,
      isAvailable: nextStock > 0 ? true : product.isAvailable,
    };
  });
}

// Bloqueia cancelamento de pedido inválido ou já cancelado.
export function ensureOrderCanBeCanceled(
  order: Order | undefined | null,
): asserts order is Order {
  if (!order) {
    throw new Error("Pedido não encontrado.");
  }

  if (order.status === "canceled") {
    throw new Error("Pedido já está cancelado.");
  }
}

// Marca o pedido como cancelado e registra quem fez isso.
export function buildCanceledOrder(order: Order, canceledBy: number): Order {
  const timestamp = new Date().toISOString();

  return {
    ...order,
    status: "canceled",
    canceledBy,
    canceledAt: timestamp,
    updatedAt: timestamp,
  };
}

// Transforma os itens do carrinho em itens salvos no pedido.
export function buildOrderItemsFromCart(cartItems: CartItem[]): OrderItem[] {
  return cartItems.map((cartItem, index) => ({
    id: index + 1,
    productId: cartItem.productId,
    productTitle: cartItem.title,
    sizeName: cartItem.sizeName,
    unitPrice: cartItem.unitPrice,
    quantity: cartItem.quantity,
    totalPrice: cartItem.totalPrice,
    addons: cartItem.addons.map((addon) => ({
      addonId: addon.id,
      addonName: addon.name,
      addonPrice: addon.price,
    })),
  }));
}

// Monta o objeto final do pedido pronto para salvar.
export function buildOrderFromCart(params: {
  existingOrders: Order[];
  userId: number;
  cartItems: CartItem[];
  paymentMethodName: PaymentMethodName;
  summary: CartSummary;
}): Order {
  const { existingOrders, userId, cartItems, paymentMethodName, summary } =
    params;

  const nextOrderId =
    existingOrders.reduce(
      (highestId, order) => Math.max(highestId, order.id),
      0,
    ) + 1;
  const timestamp = new Date().toISOString();

  return {
    id: nextOrderId,
    userId,
    paymentMethodName,
    status: "completed",
    subtotal: summary.subtotal,
    fee: summary.fee,
    total: summary.total,
    canceledBy: null,
    canceledAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    items: buildOrderItemsFromCart(cartItems),
  };
}
