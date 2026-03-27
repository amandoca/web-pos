import { useState } from "react";

import type { Product } from "../../../domain/product/product.types";
import {
  calculateNextStock,
  isValidStock,
  sanitizeStockInput,
} from "../../../domain/product/product.rules";
import { formatCurrency } from "../../../shared/formatters/currency";
import { AvailabilitySwitch } from "./AvailabilitySwitch";
import { StockEditor } from "./StockEditor";

interface AdminProductCardProps {
  product: Product;
  isUpdatingStock: boolean;
  isUpdatingAvailability: boolean;
  onUpdateStock: (productId: number, stock: number) => Promise<void>;
  onToggleAvailability: (productId: number, value: boolean) => Promise<void>;
}

// Exibe um produto com ações locais de estoque e disponibilidade.
export function AdminProductCard({
  product,
  isUpdatingStock,
  isUpdatingAvailability,
  onUpdateStock,
  onToggleAvailability,
}: AdminProductCardProps) {
  const [draftStock, setDraftStock] = useState<string>(
    // O campo começa com o estoque atual do produto.
    function getInitialDraftStock() {
      return String(product.stock);
    },
  );

  // Atualiza o valor digitado no campo de estoque.
  function handleChangeStock(value: string) {
    setDraftStock(value);
  }

  // Diminui o rascunho do estoque em 1.
  function handleDecreaseStock() {
    setDraftStock(calculateNextStock(draftStock, "decrease"));
  }

  // Aumenta o rascunho do estoque em 1.
  function handleIncreaseStock() {
    setDraftStock(calculateNextStock(draftStock, "increase"));
  }

  // Valida o número digitado e salva a mudança.
  async function handleSaveStock() {
    const nextStock = sanitizeStockInput(draftStock, product.stock);

    if (!isValidStock(nextStock)) {
      // Se o valor for inválido, voltamos para o estoque conhecido.
      setDraftStock(String(product.stock));
      return;
    }

    await onUpdateStock(product.id, nextStock);
    // Depois do sucesso, o campo acompanha o valor salvo.
    setDraftStock(String(nextStock));
  }

  // Liga ou desliga a disponibilidade do produto atual.
  async function handleToggleAvailability(nextValue: boolean) {
    await onToggleAvailability(product.id, nextValue);
  }

  return (
    <article className="admin-product-card">
      <div className="admin-product-media">
        <img src={product.imageUrl} alt={product.title} />
      </div>

      <div className="admin-product-body">
        <div className="admin-product-copy">
          <h3>{product.title}</h3>
          <p>{product.description}</p>
        </div>

        <div className="admin-product-highlights">
          <div className="admin-product-price">
            <span className="admin-field-label">Preço base</span>
            <strong>{formatCurrency(product.basePrice)}</strong>
          </div>

          <div className="admin-product-badges">
            <span className="admin-badge">Estoque {product.stock}</span>
            <span
              className={`admin-badge${product.isAvailable ? "" : " is-danger"}`}
            >
              {product.isAvailable ? "Disponivel" : "Indisponivel"}
            </span>
          </div>
        </div>

        <div className="admin-product-controls">
          <StockEditor
            stockValue={draftStock}
            isLoading={isUpdatingStock}
            onChangeStock={handleChangeStock}
            onDecreaseStock={handleDecreaseStock}
            onIncreaseStock={handleIncreaseStock}
            onSaveStock={handleSaveStock}
          />

          <AvailabilitySwitch
            isAvailable={product.isAvailable}
            isDisabled={product.stock === 0}
            isLoading={isUpdatingAvailability}
            onToggle={handleToggleAvailability}
          />
        </div>
      </div>
    </article>
  );
}
