import { useMemo } from "react";

import { useOperatorOrdersQuery } from "../queries/useOperatorOrdersQuery";

// Entrega o histórico do operador já ordenado do mais novo para o mais antigo.
export function useOperatorOrderHistory(userId: number | null) {
  const query = useOperatorOrdersQuery(userId);

  // Ordena os pedidos para deixar os mais recentes no topo da lista.
  const recentOrders = useMemo(
    function buildRecentOrders() {
      const orders = query.data ?? [];

      return [...orders].sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      );
    },
    [query.data],
  );

  return {
    recentOrders,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
