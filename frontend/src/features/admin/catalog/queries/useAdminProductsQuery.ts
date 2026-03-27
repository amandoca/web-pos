import { useQuery } from "@tanstack/react-query";

import { getProductsAction } from "../../../../application/actions/catalog.actions";

// Busca os produtos para o painel do admin.
export function useAdminProductsQuery() {
  return useQuery({
    // Essa chave aponta para o mesmo cache usado pelo restante do catálogo.
    queryKey: ["products"],
    queryFn: getProductsAction,
  });
}
