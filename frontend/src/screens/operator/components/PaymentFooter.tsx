import type { MouseEvent } from "react";

import type {
  PaymentMethod,
  PaymentMethodName,
} from "../../../domain/product/product.types";
import { getPaymentMethodLabel } from "../../../shared/formatters/payment-method-label";

interface PaymentFooterProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodName: PaymentMethodName | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  lastCompletedOrderId: number | null;
  onSelectPaymentMethod: (paymentMethodName: PaymentMethodName | null) => void;
  onCheckout: () => void;
}

// Mostra as opções de pagamento e o botão final de fechar pedido.
export function PaymentFooter({
  paymentMethods,
  selectedPaymentMethodName,
  isSubmitting,
  errorMessage,
  lastCompletedOrderId,
  onSelectPaymentMethod,
  onCheckout,
}: PaymentFooterProps) {
  // Clicar de novo na forma já escolhida limpa a seleção.
  function handleSelectPaymentMethod(event: MouseEvent<HTMLButtonElement>) {
    const paymentMethodName = event.currentTarget.value as PaymentMethodName;
    const nextPaymentMethodName =
      selectedPaymentMethodName === paymentMethodName
        ? null
        : paymentMethodName;

    onSelectPaymentMethod(nextPaymentMethodName);
  }

  return (
    <footer className="operator-payment-footer">
      <div>
        <h2>Pagamento</h2>
        <p className="operator-payment-caption">
          Escolha a forma de pagamento para finalizar.
        </p>
      </div>

      <div className="operator-payment-methods">
        {paymentMethods.map((paymentMethod) => {
          const isSelected = selectedPaymentMethodName === paymentMethod.name;

          return (
            // Cada botão representa uma forma fixa de pagamento.
            <button
              key={paymentMethod.id}
              className={`operator-payment-method${isSelected ? " is-selected" : ""}`}
              type="button"
              value={paymentMethod.name}
              aria-pressed={isSelected}
              onClick={handleSelectPaymentMethod}
            >
              {getPaymentMethodLabel(paymentMethod.name)}
            </button>
          );
        })}
      </div>

      {errorMessage ? (
        <p className="operator-error-text" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {lastCompletedOrderId ? (
        <p className="operator-success-text" role="status">
          Pedido #{lastCompletedOrderId} finalizado com sucesso.
        </p>
      ) : null}

      <button
        className="operator-primary-button operator-submit-button"
        type="button"
        disabled={isSubmitting}
        onClick={onCheckout}
      >
        {isSubmitting ? "Finalizando..." : "Finalizar pedido"}
      </button>
    </footer>
  );
}
