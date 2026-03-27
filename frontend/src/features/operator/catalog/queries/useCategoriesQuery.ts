import { useQuery } from "@tanstack/react-query";

import { getCategoriesAction } from "../../../../application/actions/catalog.actions";

// Busca as categorias para a visão do operador.
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  });
}
