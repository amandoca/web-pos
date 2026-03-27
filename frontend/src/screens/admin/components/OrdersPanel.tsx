import type { Order } from "../../../domain/order/order.types";
import { formatCurrency } from "../../../shared/formatters/currency";
import { getPaymentMethodLabel } from "../../../shared/formatters/payment-method-label";

interface OrdersPanelProps {
  orders: Order[];
  isCancelingOrder: boolean;
  onOpenCancelOrder: (order: Order) => void;
}

// Lista os pedidos exibidos na tela administrativa.
export function OrdersPanel({
  orders,
  isCancelingOrder,
  onOpenCancelOrder,
}: OrdersPanelProps) {
  return (
    <div className="admin-orders-list">
      {orders.map(function renderOrder(order) {
        return (
          <OrderListItem
            key={order.id}
            order={order}
            isCancelingOrder={isCancelingOrder}
            onOpenCancelOrder={onOpenCancelOrder}
          />
        );
      })}
    </div>
  );
}

interface OrderListItemProps {
  order: Order;
  isCancelingOrder: boolean;
  onOpenCancelOrder: (order: Order) => void;
}

// Mostra um pedido individual com resumo e ação de cancelamento.
function OrderListItem({
  order,
  isCancelingOrder,
  onOpenCancelOrder,
}: OrderListItemProps) {
  const canCancelOrder = order.status !== "canceled";
  const createdAt = new Date(order.createdAt).toLocaleString("pt-BR");

  // Envia o pedido atual para o diálogo de cancelamento.
  function handleOpenCancelOrder() {
    onOpenCancelOrder(order);
  }

  return (
    <article className="admin-order-card">
      <div className="admin-order-header">
        <div className="admin-order-title">
          <h3>Pedido #{order.id}</h3>

          <div className="admin-order-meta">
            <span>
              Pagamento: {getPaymentMethodLabel(order.paymentMethodName)}
            </span>
            <span>{order.items.length} item(ns)</span>
            <span>Criado em: {createdAt}</span>
          </div>
        </div>

        <span
          className={`admin-status-pill${
            order.status === "canceled" ? " is-canceled" : " is-completed"
          }`}
        >
          {order.status === "canceled" ? "Cancelado" : "Concluido"}
        </span>
      </div>

      <div className="admin-order-items">
        {order.items.map(function renderOrderItem(item) {
          return (
            <div key={item.id} className="admin-order-item">
              <span>
                <strong>{item.productTitle}</strong> x{item.quantity}
              </span>
              <strong>{formatCurrency(item.totalPrice)}</strong>
            </div>
          );
        })}
      </div>

      <div className="admin-order-footer">
        <div className="admin-order-meta">
          <span>Subtotal: {formatCurrency(order.subtotal)}</span>
          <span>Taxa: {formatCurrency(order.fee)}</span>
          <strong>Total: {formatCurrency(order.total)}</strong>
        </div>

        {canCancelOrder ? (
          <button
            className="admin-danger-button"
            type="button"
            disabled={isCancelingOrder}
            onClick={handleOpenCancelOrder}
          >
            {isCancelingOrder ? "Cancelando..." : "Cancelar pedido"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
