import { useMemo, useState } from "react";

import { buildCartSummary } from "../../domain/cart/cart.rules";
import type {
  Addon,
  Category,
  PaymentMethodName,
  Product,
  ProductSizeName,
} from "../../domain/product/product.types";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useCart } from "../../features/operator/cart/hooks/useCart";
import { useOperatorCategories } from "../../features/operator/catalog/hooks/useOperatorCategories";
import { useOperatorPaymentMethods } from "../../features/operator/catalog/hooks/useOperatorPaymentMethods";
import { useOperatorProducts } from "../../features/operator/catalog/hooks/useOperatorProducts";
import { useCheckout } from "../../features/operator/checkout/hooks/useCheckout";
import { useOperatorOrderHistory } from "../../features/operator/orders/hooks/useOperatorOrderHistory";
import { useProductSelection } from "../../features/operator/product-selection/hooks/useProductSelection";

const ORDER_IN_PROGRESS_LABEL = "Pedido em andamento";

// Monta o texto mostrado acima do carrinho atual.
function formatCurrentOrderLabel(
  lastCompletedOrderId: number | null,
  itemCount: number,
) {
  if (!lastCompletedOrderId || itemCount > 0) {
    return ORDER_IN_PROGRESS_LABEL;
  }

  return `Pedido #${String(lastCompletedOrderId).padStart(4, "0")}`;
}
export type OperatorCartView = "current" | "history";

// Reúne o estado e as ações da tela do operador.
export function useOperatorScreen() {
  const { currentUser, logout } = useAuth();
  const cart = useCart();
  const categoriesQuery = useOperatorCategories();
  const productsQuery = useOperatorProducts();
  const paymentMethodsQuery = useOperatorPaymentMethods();
  const checkout = useCheckout();
  const orderHistoryQuery = useOperatorOrderHistory(currentUser?.id ?? null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCartView, setActiveCartView] =
    useState<OperatorCartView>("current");
  const [productModalErrorMessage, setProductModalErrorMessage] = useState<
    string | null
  >(null);

  const productSelection = useProductSelection({ product: selectedProduct });

  // Filtra os produtos de acordo com a categoria selecionada.
  const products = useMemo(
    function filterProductsByCategory() {
      if (!selectedCategory) {
        return productsQuery.products;
      }

      return productsQuery.products.filter(function matchCategory(product) {
        return product.categoryId === selectedCategory.id;
      });
    },
    [productsQuery.products, selectedCategory],
  );

  // Calcula os totais exibidos no carrinho.
  const summary = useMemo(
    function calculateSummary() {
      return buildCartSummary(cart.items);
    },
    [cart.items],
  );

  // Decide qual rótulo mostrar para o pedido atual.
  const currentOrderLabel = useMemo(
    function getCurrentOrderLabel() {
      return formatCurrentOrderLabel(
        checkout.lastCompletedOrderId,
        cart.items.length,
      );
    },
    [checkout.lastCompletedOrderId, cart.items.length],
  );

  const isProductModalOpen = Boolean(selectedProduct);
  const isCurrentCartView = activeCartView === "current";

  // Atualiza o filtro principal da lateral de categorias.
  function handleSelectCategory(category: Category | null) {
    setSelectedCategory(category);
  }

  // Abre o modal de configuração do produto escolhido.
  function handleSelectProduct(product: Product) {
    setProductModalErrorMessage(null);
    setSelectedProduct(product);
  }

  // Fecha o modal e limpa a seleção temporária do produto.
  function handleCloseProductModal() {
    setProductModalErrorMessage(null);
    productSelection.resetSelection();
    setSelectedProduct(null);
  }

  // Tenta montar o item e adicioná-lo ao carrinho.
  function handleConfirmProduct() {
    try {
      // O hook de seleção concentra as regras de tamanho, adicionais e quantidade.
      const payload = productSelection.buildCartItemPayload();
      setProductModalErrorMessage(null);
      cart.addItem(payload);
      handleCloseProductModal();
    } catch (error) {
      // Qualquer erro de validação volta como mensagem para o modal.
      const message =
        error instanceof Error ? error.message : "Erro ao selecionar produto.";
      setProductModalErrorMessage(message);
    }
  }

  // Guarda o tamanho escolhido no estado do modal.
  function handleSelectProductSize(sizeName: ProductSizeName) {
    setProductModalErrorMessage(null);
    productSelection.selectSize(sizeName);
  }

  // Liga e desliga adicionais no produto que está sendo montado.
  function handleToggleProductAddon(addon: Addon) {
    setProductModalErrorMessage(null);
    productSelection.toggleAddon(addon);
  }

  // Aumenta a quantidade do item no modal.
  function handleIncreaseProductQuantity() {
    setProductModalErrorMessage(null);
    productSelection.increaseQuantity();
  }

  // Diminui a quantidade do item no modal.
  function handleDecreaseProductQuantity() {
    setProductModalErrorMessage(null);
    productSelection.decreaseQuantity();
  }

  // Troca a lateral entre pedido atual e histórico.
  function handleSelectCartView(view: OperatorCartView) {
    setActiveCartView(view);
  }

  // Guarda a forma de pagamento escolhida no Redux.
  function handleSelectPaymentMethod(
    paymentMethodName: PaymentMethodName | null,
  ) {
    checkout.selectPaymentMethod(paymentMethodName);
  }

  // Dispara a finalização do pedido.
  function handleCheckout() {
    checkout.submitCheckout();
  }

  return {
    activeCartView,
    categories: categoriesQuery.categories,
    currentOrderLabel,
    errorMessage: checkout.errorMessage,
    handleCheckout,
    handleCloseProductModal,
    handleConfirmProduct,
    handleDecreaseOrRemoveItem: cart.decreaseOrRemoveItem,
    handleDecreaseProductQuantity,
    handleIncreaseItemQuantity: cart.increaseItemQuantity,
    handleIncreaseProductQuantity,
    handleSelectProductSize,
    handleSelectCartView,
    handleSelectCategory,
    handleSelectPaymentMethod,
    handleSelectProduct,
    handleToggleProductAddon,
    isCategoriesLoading: categoriesQuery.isLoading,
    isCurrentCartView,
    isHistoryError: orderHistoryQuery.isError,
    isHistoryLoading: orderHistoryQuery.isLoading,
    isPaymentMethodsError: paymentMethodsQuery.isError,
    isPaymentMethodsLoading: paymentMethodsQuery.isLoading,
    isProductModalOpen,
    isProductsError: productsQuery.isError,
    isProductsLoading: productsQuery.isLoading,
    isSubmitting: checkout.isSubmitting,
    items: cart.items,
    lastCompletedOrderId: checkout.lastCompletedOrderId,
    logout,
    paymentMethods: paymentMethodsQuery.paymentMethods,
    productModalErrorMessage,
    productModalAllowedAddons: productSelection.allowedAddons,
    productModalIsLoading: productSelection.isLoading,
    productModalProductSizes: productSelection.productSizes,
    productModalQuantity: productSelection.quantity,
    productModalSelectedAddons: productSelection.selectedAddons,
    productModalSelectedSizeName: productSelection.selectedSizeName,
    productModalTotalPrice: productSelection.totalPrice,
    productModalUnitPrice: productSelection.unitPrice,
    products,
    recentOrders: orderHistoryQuery.recentOrders,
    selectedCategory,
    selectedPaymentMethodName: checkout.selectedPaymentMethodName,
    selectedProduct,
    summary,
  };
}
