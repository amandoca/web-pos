import { ORDER_FEE_PERCENTAGE } from "../../shared/constants/tax";
import {
  ensureProductIsAvailable,
  ensureRequiredSize,
  ensureStockAvailable,
  ensureUniqueAddons,
} from "../product/product.rules";
import type { Product, ProductSizeName } from "../product/product.types";
import type { CartItem, CartSummary } from "./cart.types";

export interface AddCartItemPayload {
  productId: number;
  title: string;
  imageUrl: string;
  stock: number;
  quantity: number;
  sizeName: CartItem["sizeName"];
  addons: CartItem["addons"];
  unitPrice: number;
  totalPrice: number;
}

interface CreateAddCartItemPayloadParams {
  product: Product;
  quantity: number;
  selectedAddons: CartItem["addons"];
  selectedSizeName: ProductSizeName | null;
  totalPrice: number;
  unitPrice: number;
}

// Calcula o valor final de um item com base no preço e na quantidade.
export function calculateCartItemTotal(
  unitPrice: number,
  quantity: number,
): number {
  return Number((unitPrice * quantity).toFixed(2));
}

// Soma o valor de todos os itens do carrinho.
export function calculateCartSubtotal(items: CartItem[]): number {
  const subtotal = items.reduce((total, item) => total + item.totalPrice, 0);

  return Number(subtotal.toFixed(2));
}

// Aplica a taxa fixa do pedido em cima do subtotal.
export function calculateCartFee(subtotal: number): number {
  return Number((subtotal * ORDER_FEE_PERCENTAGE).toFixed(2));
}

// Junta subtotal e taxa para chegar ao total do pedido.
export function calculateCartTotal(subtotal: number, fee: number): number {
  return Number((subtotal + fee).toFixed(2));
}

// Monta o resumo exibido no carrinho.
export function buildCartSummary(items: CartItem[]): CartSummary {
  const subtotal = calculateCartSubtotal(items);
  const fee = calculateCartFee(subtotal);
  const total = calculateCartTotal(subtotal, fee);

  return {
    subtotal,
    fee,
    feePercentage: ORDER_FEE_PERCENTAGE,
    total,
  };
}

// Cria uma chave única para identificar itens iguais no carrinho.
export function buildCartItemId(payload: AddCartItemPayload): string {
  const addonsKey = payload.addons
    .map((addon) => addon.id)
    .sort((firstId, secondId) => firstId - secondId)
    .join("-");

  return `${payload.productId}-${payload.sizeName ?? "no-size"}-${addonsKey}`;
}

// Prepara os dados do produto para virar um item do carrinho.
export function createAddCartItemPayload({
  product,
  quantity,
  selectedAddons,
  selectedSizeName,
  totalPrice,
  unitPrice,
}: CreateAddCartItemPayloadParams): AddCartItemPayload {
  ensureProductIsAvailable(product);
  ensureRequiredSize(product, selectedSizeName);
  ensureStockAvailable(product, quantity);
  ensureUniqueAddons(selectedAddons);

  return {
    productId: product.id,
    title: product.title,
    imageUrl: product.imageUrl,
    stock: product.stock,
    quantity,
    sizeName: selectedSizeName,
    addons: selectedAddons,
    unitPrice,
    totalPrice,
  };
}

// Garante que o item tenha todos os campos esperados pelo carrinho.
export function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    stock: item.stock ?? item.quantity,
  };
}

// Diz se ainda existe estoque para aumentar a quantidade.
export function canIncreaseQuantity(item: CartItem): boolean {
  return item.quantity < item.stock;
}

// Diz se diminuir o item deve removê-lo do carrinho.
export function shouldRemoveCartItem(item: CartItem): boolean {
  return item.quantity <= 1;
}

// Junta itens iguais ou cria um novo item no carrinho.
export function mergeOrCreateCartItem(
  items: CartItem[],
  payload: AddCartItemPayload,
): CartItem[] {
  const itemId = buildCartItemId(payload);
  const existingItem = items.find((item) => item.id === itemId);

  if (!existingItem) {
    return [...items, { ...payload, id: itemId }];
  }

  if (!canIncreaseQuantity(existingItem)) {
    return items;
  }

  return items.map((item) => {
    if (item.id !== itemId) {
      return item;
    }

    const nextQuantity = item.quantity + 1;

    return {
      ...item,
      quantity: nextQuantity,
      totalPrice: calculateCartItemTotal(item.unitPrice, nextQuantity),
    };
  });
}

// Aumenta a quantidade de um item já existente no carrinho.
export function increaseCartItemQuantity(
  items: CartItem[],
  cartItemId: string,
): CartItem[] {
  const selectedItem = items.find((item) => item.id === cartItemId);

  if (selectedItem && !canIncreaseQuantity(selectedItem)) {
    return items;
  }

  return items.map((item) => {
    if (item.id !== cartItemId) {
      return item;
    }

    const nextQuantity = item.quantity + 1;

    return {
      ...item,
      quantity: nextQuantity,
      totalPrice: calculateCartItemTotal(item.unitPrice, nextQuantity),
    };
  });
}

// Diminui a quantidade do item ou remove quando ele chega ao mínimo.
export function decreaseOrRemoveCartItem(
  items: CartItem[],
  cartItemId: string,
): CartItem[] {
  const item = items.find((cartItem) => cartItem.id === cartItemId);

  if (!item) {
    return items;
  }

  if (shouldRemoveCartItem(item)) {
    return items.filter((cartItem) => cartItem.id !== cartItemId);
  }

  return items.map((cartItem) => {
    if (cartItem.id !== cartItemId) {
      return cartItem;
    }

    const nextQuantity = cartItem.quantity - 1;

    return {
      ...cartItem,
      quantity: nextQuantity,
      totalPrice: calculateCartItemTotal(cartItem.unitPrice, nextQuantity),
    };
  });
}
