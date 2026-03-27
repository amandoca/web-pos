import {
  useAppDispatch,
  useAppSelector,
} from "../../../../application/store/hooks";
import {
  resetCheckout,
  setPaymentMethod,
  submitCheckoutRequest,
} from "../../../../application/store/checkout/checkout.slice";
import type { PaymentMethodName } from "../../../../domain/product/product.types";

// Entrega o estado e as ações de fechamento do pedido.
export function useCheckout() {
  const dispatch = useAppDispatch();
  const checkout = useAppSelector((state) => state.checkout);

  // Guarda a forma de pagamento escolhida na store.
  function selectPaymentMethod(paymentMethodName: PaymentMethodName | null) {
    dispatch(setPaymentMethod(paymentMethodName));
  }

  // Dispara a saga que finaliza o pedido.
  function submitCheckout() {
    dispatch(submitCheckoutRequest());
  }

  // Limpa o estado do checkout depois que ele não é mais necessário.
  function reset() {
    dispatch(resetCheckout());
  }

  return {
    selectedPaymentMethodName: checkout.selectedPaymentMethodName,
    isSubmitting: checkout.isSubmitting,
    errorMessage: checkout.errorMessage,
    lastCompletedOrderId: checkout.lastCompletedOrderId,
    selectPaymentMethod,
    submitCheckout,
    reset,
  };
}
