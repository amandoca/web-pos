import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getProductsAction,
  saveProductsAction,
} from "../../../../application/actions/catalog.actions";
import { catalogQueryKeys } from "../../../catalog/catalog-query-keys";
import {
  applyStockUpdate,
  ensureStockIsNotNegative,
} from "../../../../domain/product/product.rules";

interface UpdateProductStockParams {
  productId: number;
  stock: number;
}

// Atualiza o estoque de um produto e invalida o cache do catálogo.
export function useUpdateProductStockMutation() {
  const queryClient = useQueryClient();

  // Busca os produtos atuais, altera o item certo e salva o resultado.
  async function updateProductStock({
    productId,
    stock,
  }: UpdateProductStockParams) {
    ensureStockIsNotNegative(stock);

    // Lemos a lista atual antes de aplicar a mudança localmente.
    const products = await getProductsAction();
    const updatedProducts = applyStockUpdate(products, productId, stock);

    return saveProductsAction(updatedProducts);
  }

  // Depois de salvar, pedimos ao Query para recarregar os produtos.
  function handleSuccess() {
    queryClient.invalidateQueries({ queryKey: catalogQueryKeys.products() });
  }

  return useMutation({
    mutationFn: updateProductStock,
    onSuccess: handleSuccess,
  });
}
