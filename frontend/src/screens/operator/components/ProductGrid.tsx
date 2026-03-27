import type { Category, Product } from "../../../domain/product/product.types";
import { getCategoryLabel } from "../../../shared/formatters/category-label";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ErrorState } from "../../../shared/ui/ErrorState";
import { LoadingState } from "../../../shared/ui/LoadingState";

import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  selectedCategory: Category | null;
  onSelectProduct: (product: Product) => void;
}

// Exibe o catálogo filtrado da tela do operador.
export function ProductGrid({
  products,
  isLoading,
  isError,
  selectedCategory,
  onSelectProduct,
}: ProductGridProps) {
  const categoryLabel = getCategoryLabel(selectedCategory?.name ?? "all");
  const isSingleProduct = products.length === 1;

  // Enquanto a query carrega, mostramos o estado de loading.
  if (isLoading) {
    return (
      <section className="operator-products-section">
        <LoadingState message="Carregando produtos..." />
      </section>
    );
  }

  // Se a busca falhar, mostramos o estado de erro.
  if (isError) {
    return (
      <section className="operator-products-section">
        <ErrorState message="Erro ao carregar produtos." />
      </section>
    );
  }

  return (
    <section className="operator-products-section">
      <div className="operator-products-heading">
        <div>
          <h2>{categoryLabel}</h2>
          <p>Selecione um produto para abrir os detalhes e montar o pedido.</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="operator-empty-state">
          <EmptyState message="Nenhum produto encontrado para esta categoria." />
        </div>
      ) : (
        // Quando só existe um item, usamos uma classe especial de layout.
        <div
          className={`operator-product-grid${isSingleProduct ? " is-single" : ""}`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}
