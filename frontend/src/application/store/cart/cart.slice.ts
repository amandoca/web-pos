import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  type AddCartItemPayload,
  decreaseOrRemoveCartItem as decreaseOrRemoveCartItemRule,
  increaseCartItemQuantity as increaseCartItemQuantityRule,
  mergeOrCreateCartItem,
  normalizeCartItem,
} from "../../../domain/cart/cart.rules";
import type { CartItem } from "../../../domain/cart/cart.types";

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Guarda os itens do carrinho no Redux.
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Carrega no estado os itens vindos do storage.
    hydrateCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload.map(normalizeCartItem);
    },

    // Adiciona um item novo ou soma quantidade em um item igual.
    addCartItem(state, action: PayloadAction<AddCartItemPayload>) {
      state.items = mergeOrCreateCartItem(state.items, action.payload);
    },

    // Remove um item pelo id.
    removeCartItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Aumenta a quantidade de um item específico.
    increaseCartItemQuantity(state, action: PayloadAction<string>) {
      state.items = increaseCartItemQuantityRule(state.items, action.payload);
    },

    // Diminui a quantidade ou remove o item quando necessário.
    decreaseOrRemoveCartItem(state, action: PayloadAction<string>) {
      state.items = decreaseOrRemoveCartItemRule(state.items, action.payload);
    },

    // Volta o carrinho para o estado vazio inicial.
    clearCart() {
      return initialState;
    },
  },
});

export const {
  hydrateCartItems,
  addCartItem,
  removeCartItem,
  increaseCartItemQuantity,
  decreaseOrRemoveCartItem,
  clearCart,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
