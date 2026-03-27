import type { Order } from "../../../domain/order/order.types";

interface CancelOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

// Mostra a confirmação antes de cancelar um pedido.
export function CancelOrderDialog({
  order,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: CancelOrderDialogProps) {
  // Se não houver pedido selecionado, o diálogo nem aparece.
  if (!isOpen || !order) {
    return null;
  }

  return (
    <div className="admin-dialog-backdrop">
      <div className="admin-dialog-card">
        <div className="admin-dialog-copy">
          <h2>Cancelar pedido</h2>
          <p>Deseja cancelar o pedido #{order.id}?</p>
        </div>

        <div className="admin-dialog-actions">
          <button
            className="admin-secondary-button"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Voltar
          </button>

          <button
            className="admin-danger-button"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Cancelando..." : "Confirmar cancelamento"}
          </button>
        </div>
      </div>
    </div>
  );
}
