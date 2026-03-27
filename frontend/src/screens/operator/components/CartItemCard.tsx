import type { CartItem } from "../../../domain/cart/cart.types";
import { formatCurrency } from "../../../shared/formatters/currency";
import {
  getAddonLabel,
  getProductSizeLabel,
} from "../../../shared/formatters/product-option-label";

interface CartItemCardProps {
  item: CartItem;
  onIncrease: (cartItemId: string) => void;
  onDecrease: (cartItemId: string) => void;
}

// Mostra um item individual dentro do carrinho.
export function CartItemCard({
  item,
  onIncrease,
  onDecrease,
}: CartItemCardProps) {
  const isDecreaseDisabled = item.quantity <= 0;
  const isIncreaseDisabled = item.quantity >= item.stock;

  // Pede para diminuir a quantidade deste item.
  function handleDecrease() {
    onDecrease(item.id);
  }

  // Pede para aumentar a quantidade deste item.
  function handleIncrease() {
    onIncrease(item.id);
  }

  return (
    <article className="operator-cart-item">
      <div>
        <h3>{item.title}</h3>

        {item.sizeName ? (
          <p>Tamanho: {getProductSizeLabel(item.sizeName)}</p>
        ) : null}
      </div>

      {item.addons.length > 0 ? (
        <p>
          Adicionais:{" "}
          {item.addons.map((addon) => getAddonLabel(addon.name)).join(", ")}
        </p>
      ) : null}

      <div className="operator-cart-item-meta">
        <span>Unitário: {formatCurrency(item.unitPrice)}</span>
        <strong>{formatCurrency(item.totalPrice)}</strong>
      </div>

      <div className="operator-cart-item-controls">
        <button
          className="operator-icon-button"
          type="button"
          aria-label={`Diminuir quantidade de ${item.title}`}
          disabled={isDecreaseDisabled}
          onClick={handleDecrease}
        >
          -
        </button>

        <span className="operator-cart-item-quantity">{item.quantity}</span>

        <button
          className="operator-icon-button"
          type="button"
          aria-label={`Aumentar quantidade de ${item.title}`}
          disabled={isIncreaseDisabled}
          onClick={handleIncrease}
        >
          +
        </button>
      </div>
    </article>
  );
}
