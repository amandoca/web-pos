import { useQuery } from "@tanstack/react-query";

import { getProductsAction } from "../../../../application/actions/catalog.actions";

// Busca os produtos para a visão do operador.
export function useProductsQuery() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProductsAction,
  });
}
