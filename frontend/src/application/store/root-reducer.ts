import { combineReducers } from "@reduxjs/toolkit";

import { checkoutReducer } from "./checkout/checkout.slice";
import { authReducer } from "./auth/auth.slice";
import { cartReducer } from "./cart/cart.slice";

// Junta todos os reducers da aplicação em um único estado global.
export const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
