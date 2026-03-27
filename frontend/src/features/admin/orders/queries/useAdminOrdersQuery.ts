import { useQuery } from "@tanstack/react-query";

import { getOrdersAction } from "../../../../application/actions/orders.actions";

// Busca todos os pedidos para o painel administrativo.
export function useAdminOrdersQuery() {
  return useQuery({
    // A chave identifica a lista global de pedidos no cache.
    queryKey: ["orders"],
    queryFn: getOrdersAction,
  });
}
