import type { CartItem, CartSummary } from "../../../domain/cart/cart.types";
import type { Order } from "../../../domain/order/order.types";
import type {
  PaymentMethod,
  PaymentMethodName,
} from "../../../domain/product/product.types";
import { ErrorState } from "../../../shared/ui/ErrorState";
import { LoadingState } from "../../../shared/ui/LoadingState";

import { CartPanel } from "./CartPanel";
import { CheckoutPanel } from "./CheckoutPanel";
import { OrderHistoryPanel } from "./OrderHistoryPanel";

type CartView = "current" | "history";

interface CartSidebarProps {
  activeView: CartView;
  currentOrderLabel: string;
  errorMessage: string | null;
  isCurrentView: boolean;
  isHistoryError: boolean;
  isHistoryLoading: boolean;
  isPaymentMethodsError: boolean;
  isPaymentMethodsLoading: boolean;
  isSubmitting: boolean;
  items: CartItem[];
  lastCompletedOrderId: number | null;
  paymentMethods: PaymentMethod[];
  recentOrders: Order[];
  selectedPaymentMethodName: PaymentMethodName | null;
  summary: CartSummary;
  onCheckout: () => void;
  onDecreaseOrRemove: (cartItemId: string) => void;
  onIncreaseQuantity: (cartItemId: string) => void;
  onSelectPaymentMethod: (paymentMethodName: PaymentMethodName | null) => void;
  onSelectView: (view: CartView) => void;
}

// Controla a lateral do operador com carrinho atual e histórico.
export function CartSidebar({
  activeView,
  currentOrderLabel,
  errorMessage,
  isCurrentView,
  isHistoryError,
  isHistoryLoading,
  isPaymentMethodsError,
  isPaymentMethodsLoading,
  isSubmitting,
  items,
  lastCompletedOrderId,
  paymentMethods,
  recentOrders,
  selectedPaymentMethodName,
  summary,
  onCheckout,
  onDecreaseOrRemove,
  onIncreaseQuantity,
  onSelectPaymentMethod,
  onSelectView,
}: CartSidebarProps) {
  // Troca a lateral para a visualização do pedido atual.
  function handleSelectCurrentView() {
    onSelectView("current");
  }

  // Troca a lateral para a visualização do histórico.
  function handleSelectHistoryView() {
    onSelectView("history");
  }

  return (
    <aside className="operator-cart-sidebar">
      <header className="operator-cart-topbar">
        <div className="operator-cart-tabs">
          <button
            className={`operator-cart-tab${isCurrentView ? " is-active" : ""}`}
            type="button"
            aria-pressed={isCurrentView}
            onClick={handleSelectCurrentView}
          >
            Pedido atual
          </button>

          <button
            className={`operator-cart-tab${!isCurrentView ? " is-active" : ""}`}
            type="button"
            aria-pressed={!isCurrentView}
            onClick={handleSelectHistoryView}
          >
            Histórico
          </button>
        </div>

        {isCurrentView ? (
          <span className="operator-current-order-badge">
            {currentOrderLabel}
          </span>
        ) : null}
      </header>

      {activeView === "current" ? (
        <div className="operator-cart-current">
          <CartPanel
            items={items}
            summary={summary}
            onIncreaseQuantity={onIncreaseQuantity}
            onDecreaseOrRemove={onDecreaseOrRemove}
          />
          {/* Primeiro mostramos loading/erro das formas de pagamento; depois o checkout. */}
          {isPaymentMethodsLoading ? (
            <section className="operator-cart-panel">
              <LoadingState message="Carregando formas de pagamento..." />
            </section>
          ) : isPaymentMethodsError ? (
            <section className="operator-cart-panel">
              <ErrorState message="Erro ao carregar formas de pagamento." />
            </section>
          ) : (
            <CheckoutPanel
              paymentMethods={paymentMethods}
              selectedPaymentMethodName={selectedPaymentMethodName}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              lastCompletedOrderId={lastCompletedOrderId}
              onSelectPaymentMethod={onSelectPaymentMethod}
              onCheckout={onCheckout}
            />
          )}
        </div>
      ) : isHistoryLoading ? (
        // Enquanto o histórico carrega, mostramos o estado visual de loading.
        <section className="operator-history-panel operator-cart-panel operator-history-panel-full">
          <LoadingState message="Carregando histórico..." />
        </section>
      ) : isHistoryError ? (
        // Se a busca falhar, mostramos a mensagem de erro.
        <section className="operator-history-panel operator-cart-panel operator-history-panel-full">
          <ErrorState message="Erro ao carregar histórico de pedidos." />
        </section>
      ) : (
        <OrderHistoryPanel recentOrders={recentOrders} />
      )}
    </aside>
  );
}
