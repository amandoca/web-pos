import { useQuery } from "@tanstack/react-query";

import { getCategoriesAction } from "../../../application/actions/catalog.actions";
import { catalogQueryKeys } from "../catalog-query-keys";

// Busca as categorias usando o cache do TanStack Query.
export function useCatalogCategoriesQuery() {
  return useQuery({
    // A mesma chave é usada depois para localizar esse cache.
    queryKey: catalogQueryKeys.categories(),
    queryFn: getCategoriesAction,
  });
}
