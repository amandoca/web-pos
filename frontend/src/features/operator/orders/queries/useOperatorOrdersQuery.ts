import { useQuery } from "@tanstack/react-query";

import { getOrdersByUserIdAction } from "../../../../application/actions/orders.actions";
import { orderQueryKeys } from "../../../orders/order-query-keys";

// Busca o histórico do operador usando cache por usuário.
export function useOperatorOrdersQuery(userId: number | null) {
  return useQuery({
    // Quando existe usuário, a chave fica específica para aquele histórico.
    queryKey:
      userId === null ? orderQueryKeys.all() : orderQueryKeys.history(userId),
    queryFn: function getOperatorOrders() {
      if (userId === null) {
        // Sem usuário autenticado, não há histórico para consultar.
        return Promise.resolve([]);
      }

      return getOrdersByUserIdAction(userId);
    },
    // Só faz a consulta quando já sabemos quem é o operador.
    enabled: userId !== null,
  });
}
