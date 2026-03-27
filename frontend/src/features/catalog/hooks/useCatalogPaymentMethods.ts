import { useCatalogPaymentMethodsQuery } from "../queries/useCatalogPaymentMethodsQuery";

// Entrega as formas de pagamento de forma simples para a UI.
export function useCatalogPaymentMethods() {
  const query = useCatalogPaymentMethodsQuery();

  return {
    // Mantém o retorno estável mesmo antes da primeira resposta da query.
    paymentMethods: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
