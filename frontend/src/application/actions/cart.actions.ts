import type { CartItem } from "../../domain/cart/cart.types";

import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../storage/local-storage";
import { getUserStorageKey } from "../storage/storage-keys";

// Busca o carrinho salvo do usuário atual.
export function getCartItemsAction(userId: number | null): CartItem[] {
  if (!userId) {
    return [];
  }

  return getStorageItem<CartItem[]>(getUserStorageKey(userId, "cart"), []);
}

// Salva o estado atual do carrinho no navegador.
export function saveCartItemsAction(
  userId: number | null,
  items: CartItem[],
): void {
  if (!userId) {
    return;
  }

  setStorageItem(getUserStorageKey(userId, "cart"), items);
}

// Remove o carrinho salvo quando ele precisa ser limpo.
export function clearCartItemsAction(userId: number | null): void {
  if (!userId) {
    return;
  }

  removeStorageItem(getUserStorageKey(userId, "cart"));
}
