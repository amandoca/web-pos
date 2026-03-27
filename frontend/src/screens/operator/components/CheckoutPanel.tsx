import type {
  PaymentMethod,
  PaymentMethodName,
} from "../../../domain/product/product.types";

import { PaymentFooter } from "./PaymentFooter";

interface CheckoutPanelProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodName: PaymentMethodName | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  lastCompletedOrderId: number | null;
  onSelectPaymentMethod: (paymentMethodName: PaymentMethodName | null) => void;
  onCheckout: () => void;
}

// Encaminha os dados do checkout para o rodapé de pagamento.
export function CheckoutPanel({
  paymentMethods,
  selectedPaymentMethodName,
  isSubmitting,
  errorMessage,
  lastCompletedOrderId,
  onSelectPaymentMethod,
  onCheckout,
}: CheckoutPanelProps) {
  return (
    <PaymentFooter
      paymentMethods={paymentMethods}
      selectedPaymentMethodName={selectedPaymentMethodName}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      lastCompletedOrderId={lastCompletedOrderId}
      onSelectPaymentMethod={onSelectPaymentMethod}
      onCheckout={onCheckout}
    />
  );
}
