import type { ChangeEvent, MouseEvent } from "react";

import type {
  Addon,
  Product,
  ProductSize,
  ProductSizeName,
} from "../../../domain/product/product.types";
import { formatCurrency } from "../../../shared/formatters/currency";
import {
  getAddonLabel,
  getProductSizeLabel,
} from "../../../shared/formatters/product-option-label";

interface ProductModalProps {
  allowedAddons: Addon[];
  errorMessage: string | null;
  isLoading: boolean;
  product: Product | null;
  productSizes: ProductSize[];
  quantity: number;
  selectedAddons: Addon[];
  selectedSizeName: ProductSizeName | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onSelectSize: (sizeName: ProductSizeName) => void;
  onToggleAddon: (addon: Addon) => void;
  totalPrice: number;
  unitPrice: number;
}

// Exibe o modal onde o operador configura o produto antes de vender.
export function ProductModal({
  allowedAddons,
  errorMessage,
  isLoading,
  product,
  productSizes,
  quantity,
  selectedAddons,
  selectedSizeName,
  isOpen,
  onClose,
  onConfirm,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onSelectSize,
  onToggleAddon,
  totalPrice,
  unitPrice,
}: ProductModalProps) {
  // Sem produto selecionado, o modal não precisa aparecer.
  if (!isOpen || !product) {
    return null;
  }

  // Confirma a configuração atual e envia para a tela.
  function handleConfirm() {
    onConfirm();
  }

  const isDecreaseDisabled = quantity <= 1;
  const isIncreaseDisabled = quantity >= product.stock;

  // Lê o tamanho clicado e devolve apenas o nome para a tela.
  function handleSelectSize(event: MouseEvent<HTMLButtonElement>) {
    onSelectSize(event.currentTarget.value as ProductSizeName);
  }

  // Lê o checkbox marcado e encontra o adicional correspondente.
  function handleToggleAddon(event: ChangeEvent<HTMLInputElement>) {
    const addonId = Number(event.currentTarget.value);
    const addon = allowedAddons.find(function matchAddon(currentAddon) {
      return currentAddon.id === addonId;
    });

    // Se o adicional não existir, não fazemos nada.
    if (!addon) {
      return;
    }

    onToggleAddon(addon);
  }

  return (
    <div className="operator-modal-backdrop">
      <div className="operator-modal-card">
        <header className="operator-modal-header">
          <div>
            <h2 className="operator-modal-title">{product.title}</h2>
            <p>{product.description}</p>
          </div>
        </header>

        {isLoading ? <p>Carregando opções...</p> : null}

        {product.hasSizes && productSizes.length > 0 ? (
          <section className="operator-modal-section">
            <h3>Tamanho</h3>

            <div className="operator-choice-list">
              {productSizes.map((size) => {
                const isSelected = selectedSizeName === size.name;

                return (
                  <button
                    key={size.id}
                    className={`operator-choice-pill${isSelected ? " is-selected" : ""}`}
                    type="button"
                    value={size.name}
                    onClick={handleSelectSize}
                  >
                    {getProductSizeLabel(size.name)}{" "}
                    {size.extraPrice > 0
                      ? `(+ ${formatCurrency(size.extraPrice)})`
                      : ""}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {allowedAddons.length > 0 ? (
          <section className="operator-modal-section">
            <h3>Adicionais</h3>

            <div className="operator-addon-list">
              {allowedAddons.map((addon) => {
                const isSelected = selectedAddons.some(
                  (item) => item.id === addon.id,
                );

                return (
                  <label key={addon.id} className="operator-addon-item">
                    <span>
                      {getAddonLabel(addon.name)} ({formatCurrency(addon.price)}
                      )
                    </span>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      value={String(addon.id)}
                      onChange={handleToggleAddon}
                    />
                  </label>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="operator-modal-section">
          <h3>Quantidade</h3>

          <div className="operator-quantity-box">
            <div className="operator-quantity-controls">
              <button
                className="operator-icon-button"
                type="button"
                disabled={isDecreaseDisabled}
                onClick={onDecreaseQuantity}
              >
                -
              </button>
              <strong>{quantity}</strong>
              <button
                className="operator-icon-button"
                type="button"
                disabled={isIncreaseDisabled}
                onClick={onIncreaseQuantity}
              >
                +
              </button>
            </div>
          </div>
        </section>

        <section className="operator-price-box">
          {/* Esses valores ajudam o operador a entender o cálculo do item. */}
          <p>Preço unitário: {formatCurrency(unitPrice)}</p>
          <p>Total do item: {formatCurrency(totalPrice)}</p>
        </section>

        {errorMessage ? (
          <p className="operator-error-text">{errorMessage}</p>
        ) : null}

        <footer className="operator-modal-actions">
          <button
            className="operator-secondary-button"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="operator-primary-button"
            type="button"
            onClick={handleConfirm}
          >
            Adicionar ao carrinho
          </button>
        </footer>
      </div>
    </div>
  );
}
