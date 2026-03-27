import { useQuery } from "@tanstack/react-query";

import { getProductsAction } from "../../../application/actions/catalog.actions";
import { catalogQueryKeys } from "../catalog-query-keys";

// Busca os produtos usando o cache do TanStack Query.
export function useCatalogProductsQuery() {
  return useQuery({
    // A chave identifica o recurso para cache, refetch e invalidação.
    queryKey: catalogQueryKeys.products(),
    queryFn: getProductsAction,
  });
}
