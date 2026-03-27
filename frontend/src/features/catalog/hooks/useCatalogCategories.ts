import { useCatalogCategoriesQuery } from "../queries/useCatalogCategoriesQuery";

// Entrega as categorias já prontas para consumo na tela.
export function useCatalogCategories() {
  const query = useCatalogCategoriesQuery();

  return {
    // Evita que a tela precise tratar undefined durante o carregamento.
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
