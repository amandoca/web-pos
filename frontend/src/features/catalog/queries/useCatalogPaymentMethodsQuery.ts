import { useQuery } from "@tanstack/react-query";

import { getPaymentMethodsAction } from "../../../application/actions/catalog.actions";
import { catalogQueryKeys } from "../catalog-query-keys";

// Busca as formas de pagamento usando o cache do TanStack Query.
export function useCatalogPaymentMethodsQuery() {
  return useQuery({
    // A chave deixa o cache previsível para leitura e invalidação.
    queryKey: catalogQueryKeys.paymentMethods(),
    queryFn: getPaymentMethodsAction,
  });
}
