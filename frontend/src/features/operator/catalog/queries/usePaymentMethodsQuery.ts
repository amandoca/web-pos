import { useQuery } from "@tanstack/react-query";

import { getPaymentMethodsAction } from "../../../../application/actions/catalog.actions";

// Busca as formas de pagamento para a visão do operador.
export function usePaymentMethodsQuery() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethodsAction,
  });
}
