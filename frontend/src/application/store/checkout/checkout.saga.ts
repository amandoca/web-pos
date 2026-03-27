import { call, put, select, takeLatest } from "redux-saga/effects";

import { queryClient } from "../../../app/providers/query-client";
import {
  getOrdersAction,
  saveOrdersAction,
} from "../../actions/orders.actions";
import {
  getProductsAction,
  saveProductsAction,
} from "../../actions/catalog.actions";
import { buildCartSummary } from "../../../domain/cart/cart.rules";
import type { CartItem } from "../../../domain/cart/cart.types";
import {
  buildOrderFromCart,
  decreaseProductsStock,
  ensureCheckoutIsValid,
  ensureProductsStockForOrder,
} from "../../../domain/order/order.rules";
import type { Order } from "../../../domain/order/order.types";
import type { PaymentMethodName } from "../../../domain/product/product.types";
import type { Product } from "../../../domain/product/product.types";
import type { User } from "../../../domain/auth/auth.types";
import { catalogQueryKeys } from "../../../features/catalog/catalog-query-keys";
import { orderQueryKeys } from "../../../features/orders/order-query-keys";
import type { RootState } from "../root-reducer";
import { clearCart } from "../cart/cart.slice";
import {
  submitCheckoutFailure,
  submitCheckoutRequest,
  submitCheckoutSuccess,
} from "./checkout.slice";

// Pega os itens do carrinho salvos no Redux.
function selectCartItems(state: RootState): CartItem[] {
  return state.cart.items;
}

// Pega o usuário autenticado que está finalizando o pedido.
function selectCurrentUser(state: RootState): User | null {
  return state.auth.currentUser;
}

// Pega a forma de pagamento escolhida na tela.
function selectPaymentMethodName(state: RootState): PaymentMethodName | null {
  return state.checkout.selectedPaymentMethodName;
}

// Busca os dados necessários para concluir o pedido.
function fetchCheckoutResources() {
  return Promise.all([getProductsAction(), getOrdersAction()]);
}

// Salva os novos estoques e o novo pedido ao mesmo tempo.
function persistCheckoutResources(updatedProducts: Product[], orders: Order[]) {
  return Promise.all([
    saveProductsAction(updatedProducts),
    saveOrdersAction(orders),
  ]);
}

// Manda o React Query atualizar os caches afetados pelo checkout.
function invalidateCheckoutQueries() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: catalogQueryKeys.products() }),
    queryClient.invalidateQueries({ queryKey: orderQueryKeys.list() }),
  ]);
}

// Coordena toda a finalização do pedido usando Redux Saga e React Query.
function* handleSubmitCheckout() {
  try {
    const cartItems: CartItem[] = yield select(selectCartItems);
    const currentUser: User | null = yield select(selectCurrentUser);
    const paymentMethodName: PaymentMethodName | null = yield select(
      selectPaymentMethodName,
    );

    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    ensureCheckoutIsValid(cartItems, paymentMethodName);

    const [products, existingOrders]: [Product[], Order[]] = yield call(
      fetchCheckoutResources,
    );

    ensureProductsStockForOrder(cartItems, products);

    const updatedProducts = decreaseProductsStock(products, cartItems);
    const summary = buildCartSummary(cartItems);
    const order = buildOrderFromCart({
      existingOrders,
      userId: currentUser.id,
      cartItems,
      paymentMethodName: paymentMethodName!,
      summary,
    });

    yield call(persistCheckoutResources, updatedProducts, [
      ...existingOrders,
      order,
    ]);
    yield call(invalidateCheckoutQueries);

    yield put(submitCheckoutSuccess(order.id));
    yield put(clearCart());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao finalizar pedido.";
    yield put(submitCheckoutFailure(message));
  }
}

// Escuta a ação de finalizar pedido e dispara a saga principal.
export function* checkoutSaga() {
  yield takeLatest(submitCheckoutRequest.type, handleSubmitCheckout);
}
