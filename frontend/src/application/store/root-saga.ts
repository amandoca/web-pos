import { all, fork } from "redux-saga/effects";

import { authSaga } from "./auth/auth.saga";
import { cartSaga } from "./cart/cart.saga";
import { checkoutSaga } from "./checkout/checkout.saga";

// Junta todas as sagas principais da aplicação.
export function* rootSaga() {
  yield all([fork(authSaga), fork(cartSaga), fork(checkoutSaga)]);
}
