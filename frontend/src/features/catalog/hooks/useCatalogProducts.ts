import { useCatalogProductsQuery } from "../queries/useCatalogProductsQuery";

// Entrega a lista de produtos já pronta para a tela.
export function useCatalogProducts() {
  const query = useCatalogProductsQuery();

  return {
    // Quando a query ainda não trouxe nada, devolvemos lista vazia para simplificar a UI.
    products: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
