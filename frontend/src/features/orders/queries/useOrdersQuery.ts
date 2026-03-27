import { useQuery } from "@tanstack/react-query";

import { getOrdersAction } from "../../../application/actions/orders.actions";
import { orderQueryKeys } from "../order-query-keys";

// Busca todos os pedidos usando o cache do TanStack Query.
export function useOrdersQuery() {
  return useQuery({
    // Essa chave identifica a lista principal de pedidos no cache.
    queryKey: orderQueryKeys.list(),
    queryFn: getOrdersAction,
  });
}
