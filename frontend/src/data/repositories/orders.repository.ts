import { getStorageKey } from "../../application/storage/storage-keys";
import type { Order } from "../../domain/order/order.types";
import { ordersMock } from "../mocks/orders.mock";
import { readCollection, writeCollection } from "../sources/browser-db";

// Lê todos os pedidos salvos na base do navegador.
export async function getOrders(): Promise<Order[]> {
  return readCollection<Order[]>(getStorageKey("orders"), ordersMock);
}

// Salva a lista completa de pedidos.
export async function saveOrders(orders: Order[]): Promise<Order[]> {
  return writeCollection<Order[]>(getStorageKey("orders"), orders);
}

// Procura um pedido específico pelo id.
export async function getOrderById(orderId: number): Promise<Order | null> {
  const orders = await getOrders();

  return orders.find((order) => order.id === orderId) ?? null;
}

// Filtra apenas os pedidos de um usuário.
export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const orders = await getOrders();

  return orders.filter((order) => order.userId === userId);
}
