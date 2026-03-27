import { getAppConfig } from "../../../shared/config/app-config";

const appConfig = getAppConfig();

interface AdminSidebarProps {
  activeTab: "products" | "orders";
  productsCount: number;
  ordersCount: number;
  onChangeTab: (tab: "products" | "orders") => void;
  onLogout: () => void;
}

// Mostra a navegação lateral do painel administrativo.
export function AdminSidebar({
  activeTab,
  productsCount,
  ordersCount,
  onChangeTab,
  onLogout,
}: AdminSidebarProps) {
  // Leva o admin para a área de produtos.
  function handleSelectProductsTab() {
    onChangeTab("products");
  }

  // Leva o admin para a área de pedidos.
  function handleSelectOrdersTab() {
    onChangeTab("orders");
  }

  return (
    <aside className="admin-rail">
      <div className="admin-brand">
        <div className="admin-brand-mark">
          <img src={appConfig.brandLogo} alt={appConfig.brandName} />
        </div>
        <div className="admin-brand-title">{appConfig.brandName}</div>
      </div>

      <nav className="admin-nav">
        <p className="admin-nav-caption">Menu</p>

        <button
          className={`admin-nav-button${activeTab === "products" ? " is-active" : ""}`}
          type="button"
          aria-label="Produtos"
          title={`${productsCount} cadastrados`}
          onClick={handleSelectProductsTab}
        >
          <img src="/images/admin-icons/supplies.png" alt="" />
          <span className="admin-nav-label">Produtos</span>
        </button>

        <button
          className={`admin-nav-button${activeTab === "orders" ? " is-active" : ""}`}
          type="button"
          aria-label="Pedidos"
          title={`${ordersCount} registrados`}
          onClick={handleSelectOrdersTab}
        >
          <img src="/images/admin-icons/shopping-cart.png" alt="" />
          <span className="admin-nav-label">Pedidos</span>
        </button>
      </nav>

      <button className="admin-logout-button" type="button" onClick={onLogout}>
        Sair
      </button>
    </aside>
  );
}
