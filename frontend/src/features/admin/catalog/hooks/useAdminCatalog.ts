import { useAdminProductsQuery } from "../queries/useAdminProductsQuery";

// Entrega os produtos da visão administrativa.
export function useAdminCatalog() {
  const query = useAdminProductsQuery();

  return {
    // Mantém a tela simples mesmo antes da query responder.
    products: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
