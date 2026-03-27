import { call, put, select, takeEvery } from "redux-saga/effects";

import {
  clearCartItemsAction,
  getCartItemsAction,
  saveCartItemsAction,
} from "../../actions/cart.actions";
import type { RootState } from "../root-reducer";
import type { CartItem } from "../../../domain/cart/cart.types";
import { resetCheckout } from "../checkout/checkout.slice";
import {
  loginSuccess,
  logoutSuccess,
  restoreSessionSuccess,
} from "../auth/auth.slice";
import {
  addCartItem,
  clearCart,
  decreaseOrRemoveCartItem,
  hydrateCartItems,
  increaseCartItemQuantity,
  removeCartItem,
} from "./cart.slice";

const PERSIST_CART_ACTION_TYPES: string[] = [
  addCartItem.type,
  removeCartItem.type,
  increaseCartItemQuantity.type,
  decreaseOrRemoveCartItem.type,
];

// Lê os itens do carrinho dentro do estado global.
function selectItems(state: RootState) {
  return state.cart.items;
}

// Descobre qual usuário está com a sessão ativa.
function selectCurrentUserId(state: RootState) {
  return state.auth.currentUser?.id ?? null;
}

// Carrega o carrinho salvo do usuário quando a sessão é aberta.
function* loadCartItems() {
  const userId: number | null = yield select(selectCurrentUserId);

  if (!userId) {
    yield put(hydrateCartItems([]));
    return;
  }

  const items: ReturnType<typeof getCartItemsAction> = yield call(
    getCartItemsAction,
    userId,
  );

  yield put(hydrateCartItems(items));
}

// Persiste o carrinho toda vez que ele sofre alteração.
function* persistCart() {
  const userId: number | null = yield select(selectCurrentUserId);
  const items: CartItem[] = yield select(selectItems);

  yield call(saveCartItemsAction, userId, items);
}

// Apaga o carrinho salvo quando ele é limpo no sistema.
function* clearPersistedCart() {
  const userId: number | null = yield select(selectCurrentUserId);

  yield call(clearCartItemsAction, userId);
}

// Limpa os dados do carrinho que ficaram na memória do Redux.
function* clearInMemoryCart() {
  yield put(hydrateCartItems([]));
  yield put(resetCheckout());
}

// Liga as ações do carrinho às rotinas de persistência da saga.
export function* cartSaga() {
  yield takeEvery(PERSIST_CART_ACTION_TYPES, persistCart);
  yield takeEvery(clearCart.type, clearPersistedCart);
  yield takeEvery(loginSuccess.type, loadCartItems);
  yield takeEvery(restoreSessionSuccess.type, loadCartItems);
  yield takeEvery(logoutSuccess.type, clearInMemoryCart);
}
