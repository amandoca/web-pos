import "./operator-screen.css";

import { getAppConfig } from "../../shared/config/app-config";

import { CartSidebar } from "./components/CartSidebar";
import { CategorySidebar } from "./components/CategorySidebar";
import { ProductGrid } from "./components/ProductGrid";
import { ProductModal } from "./components/ProductModal";
import { useOperatorScreen } from "./operator-screen.hooks";

const appConfig = getAppConfig();

// Orquestra a experiência principal de venda do operador.
export function OperatorScreen() {
  const {
    activeCartView,
    barcodeValue,
    categories,
    currentOrderLabel,
    errorMessage,
    feedbackMessage,
    feedbackType,
    handleChangeBarcodeValue,
    handleCheckout,
    handleCloseProductModal,
    handleConfirmProduct,
    handleDecreaseOrRemoveItem,
    handleDecreaseProductQuantity,
    handleIncreaseItemQuantity,
    handleIncreaseProductQuantity,
    handleSelectProductSize,
    handleSelectCartView,
    handleSelectCategory,
    handleSelectPaymentMethod,
    handleSelectProduct,
    handleSubmitBarcodeSearch,
    handleToggleProductAddon,
    isCategoriesLoading,
    isCurrentCartView,
    isHistoryError,
    isHistoryLoading,
    isPaymentMethodsError,
    isPaymentMethodsLoading,
    isProductModalOpen,
    isProductsError,
    isProductsLoading,
    isSubmitting,
    items,
    lastCompletedOrderId,
    logout,
    paymentMethods,
    productModalAllowedAddons,
    productModalErrorMessage,
    productModalIsLoading,
    productModalProductSizes,
    productModalQuantity,
    productModalSelectedAddons,
    productModalSelectedSizeName,
    productModalTotalPrice,
    productModalUnitPrice,
    products,
    recentOrders,
    selectedCategory,
    selectedPaymentMethodName,
    selectedProduct,
    summary,
  } = useOperatorScreen();

  return (
    <>
      <main className="operator-screen">
        <div className="operator-shell">
          {/* Lateral com marca, categorias e saída da sessão. */}
          <aside className="operator-rail">
            <div className="operator-brand">
              <div className="operator-brand-mark">
                <img src={appConfig.brandLogo} alt={appConfig.brandName} />
              </div>
              <div>
                <div className="operator-brand-title">
                  {appConfig.brandName}
                </div>
              </div>
            </div>

            <CategorySidebar
              categories={categories}
              isLoading={isCategoriesLoading}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            <button
              className="operator-logout-button"
              type="button"
              onClick={logout}
            >
              Sair
            </button>
          </aside>

          {/* Área central com os produtos que podem ser vendidos. */}
          <section className="operator-content">
            <header className="operator-toolbar">
              <div className="operator-toolbar-copy">
                <span className="operator-toolbar-kicker">
                  Atendimento em andamento
                </span>
                <h1>{appConfig.systemTitle} Operador</h1>
                <p>
                  Navegue pelo cardápio, monte o pedido com rapidez e acompanhe
                  o fechamento no painel lateral.
                </p>
              </div>

              <form
                className="operator-barcode-form"
                onSubmit={function submitBarcodeSearch(event) {
                  event.preventDefault();
                  handleSubmitBarcodeSearch();
                }}
              >
                <label
                  className="operator-barcode-label"
                  htmlFor="operator-barcode-input"
                >
                  Código de barras
                </label>

                <div className="operator-barcode-controls">
                  <input
                    id="operator-barcode-input"
                    className="operator-barcode-input"
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    value={barcodeValue}
                    disabled={isProductsLoading}
                    onChange={function changeBarcodeValue(event) {
                      handleChangeBarcodeValue(event.currentTarget.value);
                    }}
                    placeholder="Leia ou digite o código"
                  />

                  <button
                    className="operator-primary-button"
                    type="submit"
                    disabled={isProductsLoading}
                  >
                    Buscar
                  </button>
                </div>

                <p className="operator-barcode-hint">
                  Aceita digitação manual e leitor físico.
                </p>
              </form>
            </header>

            {feedbackMessage ? (
              <div
                className={`operator-feedback${feedbackType === "error" ? " is-error" : " is-success"}`}
                role="status"
              >
                {feedbackMessage}
              </div>
            ) : null}

            <ProductGrid
              products={products}
              isLoading={isProductsLoading}
              isError={isProductsError}
              selectedCategory={selectedCategory}
              onSelectProduct={handleSelectProduct}
            />
          </section>

          {/* Painel lateral com carrinho atual, pagamento e histórico. */}
          <CartSidebar
            activeView={activeCartView}
            currentOrderLabel={currentOrderLabel}
            errorMessage={errorMessage}
            isCurrentView={isCurrentCartView}
            isHistoryError={isHistoryError}
            isHistoryLoading={isHistoryLoading}
            isPaymentMethodsError={isPaymentMethodsError}
            isPaymentMethodsLoading={isPaymentMethodsLoading}
            isSubmitting={isSubmitting}
            items={items}
            lastCompletedOrderId={lastCompletedOrderId}
            paymentMethods={paymentMethods}
            recentOrders={recentOrders}
            selectedPaymentMethodName={selectedPaymentMethodName}
            summary={summary}
            onCheckout={handleCheckout}
            onDecreaseOrRemove={handleDecreaseOrRemoveItem}
            onIncreaseQuantity={handleIncreaseItemQuantity}
            onSelectPaymentMethod={handleSelectPaymentMethod}
            onSelectView={handleSelectCartView}
          />
        </div>
      </main>

      {/* Modal usado para configurar tamanho, adicionais e quantidade do produto. */}
      <ProductModal
        key={selectedProduct?.id ?? "closed"}
        allowedAddons={productModalAllowedAddons}
        errorMessage={productModalErrorMessage}
        isLoading={productModalIsLoading}
        product={selectedProduct}
        productSizes={productModalProductSizes}
        quantity={productModalQuantity}
        selectedAddons={productModalSelectedAddons}
        selectedSizeName={productModalSelectedSizeName}
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        onConfirm={handleConfirmProduct}
        onDecreaseQuantity={handleDecreaseProductQuantity}
        onIncreaseQuantity={handleIncreaseProductQuantity}
        onSelectSize={handleSelectProductSize}
        onToggleAddon={handleToggleProductAddon}
        totalPrice={productModalTotalPrice}
        unitPrice={productModalUnitPrice}
      />
    </>
  );
}
