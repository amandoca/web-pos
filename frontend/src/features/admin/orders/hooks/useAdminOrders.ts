import { useAdminOrdersQuery } from "../queries/useAdminOrdersQuery";

// Entrega os pedidos para o painel do admin.
export function useAdminOrders() {
  const query = useAdminOrdersQuery();

  return {
    // Usa lista vazia até a query carregar.
    orders: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
