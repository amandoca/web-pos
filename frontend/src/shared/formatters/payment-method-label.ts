import type { PaymentMethodName } from "../../domain/product/product.types";

// Traduz o nome técnico do pagamento para um texto simples.
export function getPaymentMethodLabel(paymentMethodName: PaymentMethodName) {
  switch (paymentMethodName) {
    case "cash":
      return "Dinheiro";
    case "debit_card":
      return "Cartão de débito";
    case "credit_card":
      return "Cartão de crédito";
    case "pix":
      return "Pix";
    default:
      return paymentMethodName;
  }
}
