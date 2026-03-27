import type { Order } from "../../../domain/order/order.types";
import { formatCurrency } from "../../../shared/formatters/currency";

interface OrderHistoryPanelProps {
  recentOrders: Order[];
}

// Exibe os pedidos mais recentes do operador.
export function OrderHistoryPanel({ recentOrders }: OrderHistoryPanelProps) {
  return (
    <section className="operator-history-panel operator-cart-panel operator-history-panel-full">
      <div className="operator-history-header">
        <h3>Histórico de pedidos</h3>
        <span>{recentOrders.length}</span>
      </div>

      {recentOrders.length === 0 ? (
        <p className="operator-history-empty">
          Nenhum pedido recente para este operador.
        </p>
      ) : (
        // Quando há histórico, renderizamos um card para cada pedido.
        <div className="operator-history-list">
          {recentOrders.map((order) => {
            const isCanceled = order.status === "canceled";

            return (
              <article key={order.id} className="operator-history-card">
                <div className="operator-history-row operator-history-row-top">
                  <strong className="operator-history-order-title">
                    Pedido #{order.id}
                  </strong>
                  <span
                    className={`operator-history-status${isCanceled ? " is-canceled" : ""}`}
                    aria-label={isCanceled ? "Cancelado" : "Concluído"}
                  >
                    {isCanceled ? "Cancelado" : "Concluído"}
                  </span>
                </div>

                <div className="operator-history-row operator-history-row-bottom">
                  <span>{order.items.length} item(ns)</span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
