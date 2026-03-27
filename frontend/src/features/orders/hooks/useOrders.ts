import { useOrdersQuery } from "../queries/useOrdersQuery";

// Entrega a lista de pedidos já pronta para consumo.
export function useOrders() {
  const query = useOrdersQuery();

  return {
    // Usa lista vazia até a query responder para simplificar a tela.
    orders: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
