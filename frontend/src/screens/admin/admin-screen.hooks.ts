import { useState } from "react";

import type { Order } from "../../domain/order/order.types";
import { useAdminCatalog } from "../../features/admin/catalog/hooks/useAdminCatalog";
import { useAdminMutations } from "../../features/admin/mutations/hooks/useAdminMutations";
import { useAdminOrders } from "../../features/admin/orders/hooks/useAdminOrders";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useFeedback } from "../../shared/hooks/useFeedback";

type AdminTab = "products" | "orders";

// Reúne o estado e as ações da tela administrativa.
export function useAdminScreen() {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(
    null,
  );
  const [updatingAvailabilityId, setUpdatingAvailabilityId] = useState<
    number | null
  >(null);
  const [selectedOrderForCancel, setSelectedOrderForCancel] =
    useState<Order | null>(null);

  const { currentUser, logout } = useAuth();
  const {
    products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useAdminCatalog();
  const {
    orders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
  } = useAdminOrders();
  const { updateStock, updateAvailability, cancelOrder, isCancelingOrder } =
    useAdminMutations();
  const { feedbackMessage, feedbackType, showFeedback } = useFeedback();

  const isProductsTab = activeTab === "products";
  const sectionTitle = isProductsTab ? "Produtos" : "Pedidos";
  const sectionDescription = isProductsTab
    ? "Atualize estoque e disponibilidade sem perder o contexto visual dos itens."
    : "Acompanhe os pedidos recentes e execute cancelamentos.";
  const sectionCount = isProductsTab ? products.length : orders.length;
  const isLoading = isProductsTab ? isLoadingProducts : isLoadingOrders;
  const isError = isProductsTab ? isErrorProducts : isErrorOrders;

  // Troca a aba principal entre produtos e pedidos.
  function handleSelectTab(tab: AdminTab) {
    setActiveTab(tab);
  }

  // Atualiza o estoque e mostra feedback visual na própria tela.
  async function handleUpdateStock(productId: number, stock: number) {
    try {
      // Guardamos o id para mostrar loading só no item em edição.
      setUpdatingProductId(productId);
      await updateStock(productId, stock);
      showFeedback("Estoque atualizado com sucesso.", "success");
    } catch {
      showFeedback("Erro ao atualizar estoque.", "error");
    } finally {
      setUpdatingProductId(null);
    }
  }

  // Atualiza a disponibilidade do produto e devolve feedback para a UI.
  async function handleUpdateAvailability(
    productId: number,
    isAvailable: boolean,
  ) {
    try {
      // Guardamos o id para bloquear apenas o switch ativo.
      setUpdatingAvailabilityId(productId);
      await updateAvailability(productId, isAvailable);
      showFeedback("Disponibilidade atualizada com sucesso.", "success");
    } catch {
      showFeedback("Erro ao atualizar disponibilidade.", "error");
    } finally {
      setUpdatingAvailabilityId(null);
    }
  }

  // Abre o diálogo de cancelamento com o pedido escolhido.
  function handleOpenCancelOrder(order: Order) {
    setSelectedOrderForCancel(order);
  }

  // Fecha o diálogo sem cancelar o pedido.
  function handleCloseCancelOrder() {
    setSelectedOrderForCancel(null);
  }

  // Confirma o cancelamento e mostra o resultado para o admin.
  async function handleConfirmCancelOrder() {
    if (!selectedOrderForCancel || !currentUser) return;

    try {
      // O user id é usado para registrar quem executou o cancelamento.
      await cancelOrder(selectedOrderForCancel.id, currentUser.id);
      showFeedback("Pedido cancelado com sucesso.", "success");
    } catch {
      showFeedback("Erro ao cancelar pedido.", "error");
    } finally {
      setSelectedOrderForCancel(null);
    }
  }

  return {
    activeTab,
    handleSelectTab,
    products,
    orders,
    sectionTitle,
    sectionDescription,
    sectionCount,
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
  };
}
