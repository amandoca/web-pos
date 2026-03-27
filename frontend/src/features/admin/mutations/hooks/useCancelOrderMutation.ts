import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getProductsAction,
  saveProductsAction,
} from "../../../../application/actions/catalog.actions";
import {
  getOrdersAction,
  saveOrdersAction,
} from "../../../../application/actions/orders.actions";
import {
  buildCanceledOrder,
  ensureOrderCanBeCanceled,
  restoreProductsStock,
} from "../../../../domain/order/order.rules";
import { catalogQueryKeys } from "../../../catalog/catalog-query-keys";
import { orderQueryKeys } from "../../../orders/order-query-keys";

interface CancelOrderParams {
  orderId: number;
  userId: number;
}

// Cancela pedidos e sincroniza os caches afetados.
export function useCancelOrderMutation() {
  const queryClient = useQueryClient();

  // Busca pedidos e produtos, aplica o cancelamento e salva as duas listas.
  async function cancelOrder({ orderId, userId }: CancelOrderParams) {
    const [orders, products] = await Promise.all([
      getOrdersAction(),
      getProductsAction(),
    ]);

    // Encontramos o pedido certo antes de validar e cancelar.
    const orderToCancel = orders.find(function findOrder(order) {
      return order.id === orderId;
    });

    ensureOrderCanBeCanceled(orderToCancel);

    // Atualizamos o pedido cancelado e devolvemos o estoque dos itens.
    const canceledOrder = buildCanceledOrder(orderToCancel, userId);
    const updatedOrders = orders.map(function updateOrder(order) {
      return order.id === orderId ? canceledOrder : order;
    });
    const updatedProducts = restoreProductsStock(products, orderToCancel);

    await Promise.all([
      saveOrdersAction(updatedOrders),
      saveProductsAction(updatedProducts),
    ]);
  }

  // Atualiza o cache de produtos e pedidos depois do cancelamento.
  function handleSuccess() {
    queryClient.invalidateQueries({ queryKey: catalogQueryKeys.products() });
    queryClient.invalidateQueries({ queryKey: orderQueryKeys.list() });
  }

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: handleSuccess,
  });
}
