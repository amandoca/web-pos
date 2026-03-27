import { useQuery } from "@tanstack/react-query";

import { getSizesByProductIdAction } from "../../../../application/actions/catalog.actions";
import { catalogQueryKeys } from "../../../catalog/catalog-query-keys";

// Busca os tamanhos disponíveis para o produto aberto no modal.
export function useProductSizesQuery(productId: number, enabled = true) {
  // Mantemos a função separada para o Query chamar quando necessário.
  function getProductSizes() {
    return getSizesByProductIdAction(productId);
  }

  return useQuery({
    // A chave específica evita misturar tamanhos entre produtos.
    queryKey: catalogQueryKeys.productSizes(productId),
    queryFn: getProductSizes,
    // Só consulta quando há um produto válido selecionado.
    enabled: enabled && productId > 0,
  });
}
