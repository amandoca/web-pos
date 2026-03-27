import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { PaymentMethodName } from "../../../domain/product/product.types";

export interface CheckoutState {
  selectedPaymentMethodName: PaymentMethodName | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  lastCompletedOrderId: number | null;
}

const initialState: CheckoutState = {
  selectedPaymentMethodName: null,
  isSubmitting: false,
  errorMessage: null,
  lastCompletedOrderId: null,
};

// Guarda o estado do fechamento do pedido no Redux.
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // Salva a forma de pagamento escolhida pela tela.
    setPaymentMethod(state, action: PayloadAction<PaymentMethodName | null>) {
      state.selectedPaymentMethodName = action.payload;
      state.errorMessage = null;
    },

    // Marca o checkout como em andamento antes da saga rodar.
    submitCheckoutRequest(state) {
      state.isSubmitting = true;
      state.errorMessage = null;
    },

    // Guarda o id do último pedido finalizado com sucesso.
    submitCheckoutSuccess(state, action: PayloadAction<number>) {
      state.selectedPaymentMethodName = null;
      state.isSubmitting = false;
      state.errorMessage = null;
      state.lastCompletedOrderId = action.payload;
    },

    // Guarda a mensagem de erro quando o checkout falha.
    submitCheckoutFailure(state, action: PayloadAction<string>) {
      state.isSubmitting = false;
      state.errorMessage = action.payload;
    },

    // Limpa o estado temporário do checkout.
    resetCheckout() {
      return initialState;
    },
  },
});

export const {
  setPaymentMethod,
  submitCheckoutRequest,
  submitCheckoutSuccess,
  submitCheckoutFailure,
  resetCheckout,
} = checkoutSlice.actions;

export const checkoutReducer = checkoutSlice.reducer;
