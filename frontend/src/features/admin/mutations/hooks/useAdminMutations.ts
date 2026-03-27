import { useCancelOrderMutation } from "./useCancelOrderMutation";
import { useUpdateProductAvailabilityMutation } from "./useUpdateProductAvailabilityMutation";
import { useUpdateProductStockMutation } from "./useUpdateProductStockMutation";

// Reúne as mutações usadas pela tela de admin.
export function useAdminMutations() {
  const updateProductStockMutation = useUpdateProductStockMutation();
  const updateProductAvailabilityMutation =
    useUpdateProductAvailabilityMutation();
  const cancelOrderMutation = useCancelOrderMutation();

  // Atualiza o estoque e espera a mutation terminar para a tela reagir.
  async function updateStock(productId: number, stock: number) {
    await updateProductStockMutation.mutateAsync({ productId, stock });
  }

  // Atualiza a disponibilidade do produto.
  async function updateAvailability(productId: number, isAvailable: boolean) {
    await updateProductAvailabilityMutation.mutateAsync({
      productId,
      isAvailable,
    });
  }

  // Cancela um pedido e devolve o estoque.
  async function cancelOrder(orderId: number, userId: number) {
    await cancelOrderMutation.mutateAsync({ orderId, userId });
  }

  return {
    updateStock,
    updateAvailability,
    cancelOrder,
    isCancelingOrder: cancelOrderMutation.isPending,
  };
}
