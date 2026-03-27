import { useQuery } from "@tanstack/react-query";

import { getAllowedAddonsByProductIdAction } from "../../../../application/actions/catalog.actions";
import { catalogQueryKeys } from "../../../catalog/catalog-query-keys";

// Busca os adicionais permitidos para o produto aberto no modal.
export function useAllowedAddonsQuery(productId: number, enabled = true) {
  // Mantemos a função separada para o Query executar quando precisar.
  function getAllowedAddons() {
    return getAllowedAddonsByProductIdAction(productId);
  }

  return useQuery({
    // A chave específica evita misturar cache entre produtos diferentes.
    queryKey: catalogQueryKeys.addons(productId),
    queryFn: getAllowedAddons,
    // Só consulta quando existe produto válido e o modal está ativo.
    enabled: enabled && productId > 0,
  });
}
