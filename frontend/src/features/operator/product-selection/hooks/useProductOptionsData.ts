import { useAllowedAddonsQuery } from "../queries/useAllowedAddonsQuery";
import { useProductSizesQuery } from "../queries/useProductSizesQuery";

// Junta adicionais e tamanhos para a configuração do produto.
export function useProductOptionsData(productId: number, enabled = true) {
  const addonsQuery = useAllowedAddonsQuery(productId, enabled);
  const sizesQuery = useProductSizesQuery(productId, enabled);

  return {
    // Devolve listas vazias enquanto os dados ainda estão chegando.
    allowedAddons: addonsQuery.data ?? [],
    productSizes: sizesQuery.data ?? [],
    isLoading: addonsQuery.isLoading || sizesQuery.isLoading,
    isError: addonsQuery.isError || sizesQuery.isError,
  };
}
