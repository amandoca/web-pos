import type { ChangeEvent } from "react";

interface StockEditorProps {
  stockValue: string;
  isLoading?: boolean;
  onChangeStock: (value: string) => void;
  onDecreaseStock: () => void;
  onIncreaseStock: () => void;
  onSaveStock: () => Promise<void>;
}

// Exibe os controles usados para ajustar o estoque.
export function StockEditor({
  stockValue,
  isLoading = false,
  onChangeStock,
  onDecreaseStock,
  onIncreaseStock,
  onSaveStock,
}: StockEditorProps) {
  // Converte o evento do input para um valor simples de texto.
  function handleChangeStock(event: ChangeEvent<HTMLInputElement>) {
    onChangeStock(event.target.value);
  }

  return (
    <div className="admin-stock-editor">
      <span className="admin-field-label">Ajustar estoque</span>

      <div className="admin-stock-controls">
        <button
          className="admin-icon-button"
          type="button"
          onClick={onDecreaseStock}
          disabled={isLoading}
          aria-label="Diminuir estoque"
        >
          -
        </button>

        <input
          className="admin-stock-input"
          type="number"
          min={0}
          value={stockValue}
          disabled={isLoading}
          onChange={handleChangeStock}
          aria-label="Valor do estoque"
        />

        <button
          className="admin-icon-button"
          type="button"
          onClick={onIncreaseStock}
          disabled={isLoading}
          aria-label="Aumentar estoque"
        >
          +
        </button>

        <button
          className="admin-action-button"
          type="button"
          onClick={onSaveStock}
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
