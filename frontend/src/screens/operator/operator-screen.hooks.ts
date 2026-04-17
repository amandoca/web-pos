import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  buildCartSummary,
  createAddCartItemPayload,
} from "../../domain/cart/cart.rules";
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
import { useFeedback } from "../../shared/hooks/useFeedback";

const ORDER_IN_PROGRESS_LABEL = "Pedido em andamento";
const BARCODE_AUTO_SUBMIT_DELAY_MS = 150;

function normalizeBarcode(rawValue: string): string {
  return rawValue.replace(/\s+/g, "").trim();
}

function requiresProductConfiguration(product: Product): boolean {
  return product.hasSizes || product.addonIds.length > 0;
}

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
  const [barcodeValue, setBarcodeValue] = useState("");
  const [productModalErrorMessage, setProductModalErrorMessage] = useState<
    string | null
  >(null);
  // Evita que a mesma leitura do scanner USB dispare buscas duplicadas.
  const lastSubmittedBarcodeRef = useRef("");

  const productSelection = useProductSelection({ product: selectedProduct });
  const { feedbackMessage, feedbackType, showFeedback } = useFeedback();

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

  // Atualiza o campo que recebe digitação manual ou leitor físico.
  function handleChangeBarcodeValue(value: string) {
    setBarcodeValue(value);
  }

  // Busca o produto pelo código de barras e reaproveita o fluxo de seleção.
  const handleSearchProductByBarcode = useCallback(
    function handleSearchProductByBarcode(barcode: string) {
      const normalizedBarcode = normalizeBarcode(barcode);

      if (!normalizedBarcode) {
        showFeedback("Digite ou leia um código de barras.", "error");
        return false;
      }

      // A leitura já processada limpa o campo para a próxima passada do leitor.
      lastSubmittedBarcodeRef.current = normalizedBarcode;
      setBarcodeValue("");

      const matchedProduct = productsQuery.products.find(function findProduct(
        product,
      ) {
        return normalizeBarcode(product.barcode ?? "") === normalizedBarcode;
      });

      if (!matchedProduct) {
        showFeedback("Produto não encontrado para o código informado.", "error");
        return false;
      }

      const matchedCategory = categoriesQuery.categories.find(
        function findCategory(category) {
          return category.id === matchedProduct.categoryId;
        },
      );

      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
      }

      if (requiresProductConfiguration(matchedProduct)) {
        handleSelectProduct(matchedProduct);
        showFeedback(
          "Produto encontrado. Escolha as opções para continuar.",
          "success",
        );
        return true;
      }

      try {
        const cartItemPayload = createAddCartItemPayload({
          product: matchedProduct,
          quantity: 1,
          selectedAddons: [],
          selectedSizeName: null,
          totalPrice: matchedProduct.basePrice,
          unitPrice: matchedProduct.basePrice,
        });

        cart.addItem(cartItemPayload);
        showFeedback(
          `${matchedProduct.title} adicionado ao carrinho.`,
          "success",
        );
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível adicionar o produto.";

        showFeedback(message, "error");
        return false;
      }
    },
    [cart, categoriesQuery.categories, productsQuery.products, showFeedback],
  );

  function handleSubmitBarcodeSearch() {
    handleSearchProductByBarcode(barcodeValue);
  }

  useEffect(
    function resetLastSubmittedBarcodeWhenInputClears() {
      if (barcodeValue) {
        return;
      }

      // Campo vazio significa que a próxima leitura pode ser tratada como nova.
      lastSubmittedBarcodeRef.current = "";
    },
    [barcodeValue],
  );

  useEffect(
    function submitBarcodeReaderValueAutomatically() {
      const normalizedBarcode = normalizeBarcode(barcodeValue);
      const hasPendingBarcode = Boolean(normalizedBarcode);
      const hasBarcodeAlreadySubmitted =
        lastSubmittedBarcodeRef.current === normalizedBarcode;

      if (
        !hasPendingBarcode ||
        hasBarcodeAlreadySubmitted ||
        isProductModalOpen ||
        productsQuery.isLoading
      ) {
        return;
      }

      // Dá um pequeno intervalo para o leitor terminar de "digitar" o código.
      const autoSubmitTimeout = window.setTimeout(function submitBarcode() {
        handleSearchProductByBarcode(barcodeValue);
      }, BARCODE_AUTO_SUBMIT_DELAY_MS);

      return function cleanupAutoSubmitTimeout() {
        window.clearTimeout(autoSubmitTimeout);
      };
    },
    [
      barcodeValue,
      handleSearchProductByBarcode,
      isProductModalOpen,
      productsQuery.isLoading,
    ],
  );

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
    barcodeValue,
    errorMessage: checkout.errorMessage,
    feedbackMessage,
    feedbackType,
    handleChangeBarcodeValue,
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
    handleSubmitBarcodeSearch,
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
