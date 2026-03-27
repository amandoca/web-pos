import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getProductsAction,
  saveProductsAction,
} from "../../../../application/actions/catalog.actions";
import { applyAvailabilityUpdate } from "../../../../domain/product/product.rules";
import { catalogQueryKeys } from "../../../catalog/catalog-query-keys";

interface UpdateProductAvailabilityParams {
  productId: number;
  isAvailable: boolean;
}

// Atualiza a disponibilidade do produto e refresca o cache.
export function useUpdateProductAvailabilityMutation() {
  const queryClient = useQueryClient();

  // Lê a lista atual, ajusta o item escolhido e salva tudo novamente.
  async function updateProductAvailability({
    productId,
    isAvailable,
  }: UpdateProductAvailabilityParams) {
    const products = await getProductsAction();
    const updatedProducts = applyAvailabilityUpdate(
      products,
      productId,
      isAvailable,
    );

    return saveProductsAction(updatedProducts);
  }

  // Invalida o cache para a tela buscar os dados já atualizados.
  function handleSuccess() {
    queryClient.invalidateQueries({ queryKey: catalogQueryKeys.products() });
  }

  return useMutation({
    mutationFn: updateProductAvailability,
    onSuccess: handleSuccess,
  });
}
