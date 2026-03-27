import type { CartItem, CartSummary } from "../../../domain/cart/cart.types";
import { formatCurrency } from "../../../shared/formatters/currency";
import { EmptyState } from "../../../shared/ui/EmptyState";

import { CartItemCard } from "./CartItemCard";

interface CartPanelProps {
  items: CartItem[];
  summary: CartSummary;
  onIncreaseQuantity: (cartItemId: string) => void;
  onDecreaseOrRemove: (cartItemId: string) => void;
}

// Exibe o conteúdo atual do carrinho e seus totais.
export function CartPanel({
  items,
  summary,
  onIncreaseQuantity,
  onDecreaseOrRemove,
}: CartPanelProps) {
  return (
    <section className="operator-cart-panel">
      <div className="operator-cart-header">
        <h2>Carrinho</h2>
        <span>{items.length} item(ns)</span>
      </div>

      {items.length === 0 ? (
        <div className="operator-cart-empty">
          <EmptyState message="Carrinho vazio." />
        </div>
      ) : (
        // Quando há itens, mostramos um card para cada linha do carrinho.
        <div className="operator-cart-items">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onIncrease={onIncreaseQuantity}
              onDecrease={onDecreaseOrRemove}
            />
          ))}
        </div>
      )}

      <div className="operator-cart-summary">
        <div className="operator-cart-summary-line">
          <span>Subtotal</span>
          <span>{formatCurrency(summary.subtotal)}</span>
        </div>
        <div className="operator-cart-summary-line">
          <span>Taxa ({summary.feePercentage * 100}%)</span>
          <span>{formatCurrency(summary.fee)}</span>
        </div>
        <div className="operator-cart-summary-total">
          <span>Total</span>
          <span>{formatCurrency(summary.total)}</span>
        </div>
      </div>
    </section>
  );
}
