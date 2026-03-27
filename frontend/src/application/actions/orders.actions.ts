import type { Order } from "../../domain/order/order.types";
import {
  getOrderById,
  getOrdersByUserId,
  getOrders,
  saveOrders,
} from "../../data/repositories/orders.repository";

// Busca todos os pedidos salvos.
export function getOrdersAction() {
  return getOrders();
}

// Busca apenas os pedidos de um usuário.
export function getOrdersByUserIdAction(userId: number) {
  return getOrdersByUserId(userId);
}

// Busca um pedido específico pelo identificador.
export function getOrderByIdAction(orderId: number) {
  return getOrderById(orderId);
}

// Salva a lista completa de pedidos.
export function saveOrdersAction(orders: Order[]) {
  return saveOrders(orders);
}
