import "./admin-screen.css";

import { getAppConfig } from "../../shared/config/app-config";

import { AdminSidebar } from "./components/AdminSidebar";
import { AdminProductGrid } from "./components/AdminProductGrid";
import { CancelOrderDialog } from "./components/CancelOrderDialog";
import { OrdersPanel } from "./components/OrdersPanel";
import { useAdminScreen } from "./admin-screen.hooks";

const appConfig = getAppConfig();

// Orquestra a interface principal do administrador.
export function AdminScreen() {
  const {
    activeTab,
    handleSelectTab,
    products,
    orders,
    sectionTitle,
    sectionDescription,
    isProductsTab,
    isLoading,
    isError,
    updatingProductId,
    updatingAvailabilityId,
    isCancelingOrder,
    selectedOrderForCancel,
    feedbackMessage,
    feedbackType,
    handleUpdateStock,
    handleUpdateAvailability,
    handleOpenCancelOrder,
    handleCloseCancelOrder,
    handleConfirmCancelOrder,
    logout,
  } = useAdminScreen();

  return (
    <main className="admin-screen">
      <div className="admin-shell">
        <AdminSidebar
          activeTab={activeTab}
          productsCount={products.length}
          ordersCount={orders.length}
          onChangeTab={handleSelectTab}
          onLogout={logout}
        />

        <section className="admin-content">
          <header className="admin-toolbar">
            <div className="admin-toolbar-copy">
              <span className="admin-toolbar-kicker">Painel</span>
              <h1>{appConfig.systemTitle} Administrador</h1>
              <p>Gerencie produtos, estoque e pedidos.</p>
            </div>

            <div className="admin-toolbar-stats">
              <div className="admin-stat-pill">
                <span>Produtos</span>
                <strong>{products.length}</strong>
              </div>
              <div className="admin-stat-pill">
                <span>Pedidos</span>
                <strong>{orders.length}</strong>
              </div>
            </div>
          </header>

          <section className="admin-surface">
            <div className="admin-section-heading">
              <div>
                <h2>{sectionTitle}</h2>
                <p>{sectionDescription}</p>
              </div>
            </div>

            {/* Mostra um aviso curto depois de ações como salvar ou cancelar. */}
            {feedbackMessage ? (
              <div
                className={`admin-feedback${feedbackType === "error" ? " is-error" : " is-success"}`}
                role="status"
              >
                {feedbackMessage}
              </div>
            ) : null}

            {/* Exibe o carregamento da aba atual. */}
            {isLoading ? (
              <div className="admin-feedback">
                Carregando {sectionTitle.toLowerCase()}...
              </div>
            ) : null}

            {/* Exibe erro quando a busca da aba atual falha. */}
            {isError ? (
              <div className="admin-feedback is-error">
                Nao foi possivel carregar {sectionTitle.toLowerCase()} agora.
              </div>
            ) : null}

            {/* Na aba de produtos, mostramos a grade com estoque e disponibilidade. */}
            {!isLoading && !isError && isProductsTab ? (
              <AdminProductGrid
                products={products}
                updatingProductId={updatingProductId}
                updatingAvailabilityId={updatingAvailabilityId}
                onUpdateStock={handleUpdateStock}
                onToggleAvailability={handleUpdateAvailability}
              />
            ) : null}

            {/* Na aba de pedidos, mostramos a lista pronta para cancelamento. */}
            {!isLoading && !isError && !isProductsTab ? (
              <OrdersPanel
                orders={orders}
                isCancelingOrder={isCancelingOrder}
                onOpenCancelOrder={handleOpenCancelOrder}
              />
            ) : null}
          </section>
        </section>
      </div>

      {/* O diálogo só aparece quando existe um pedido selecionado para cancelar. */}
      <CancelOrderDialog
        order={selectedOrderForCancel}
        isOpen={Boolean(selectedOrderForCancel)}
        isLoading={isCancelingOrder}
        onClose={handleCloseCancelOrder}
        onConfirm={handleConfirmCancelOrder}
      />
    </main>
  );
}
