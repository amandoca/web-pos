import type { Product } from "../../../domain/product/product.types";
import { formatCurrency } from "../../../shared/formatters/currency";

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

// Mostra um produto clicável no catálogo do operador.
export function ProductCard({ product, onSelectProduct }: ProductCardProps) {
  const isUnavailable = !product.isAvailable || product.stock <= 0;
  const productImageSrc = product.imageUrl || "/images/eat.png";

  // Abre o fluxo de configuração do produto escolhido.
  function handleSelectProduct() {
    onSelectProduct(product);
  }

  return (
    <article
      className={`operator-product-card${isUnavailable ? " is-unavailable" : ""}`}
    >
      <div className="operator-product-media">
        <img src={productImageSrc} alt={product.title} />

        {isUnavailable ? (
          <div className="operator-product-unavailable">Indisponível</div>
        ) : null}
      </div>

      <div className="operator-product-body">
        <div className="operator-product-copy">
          <h3>{product.title}</h3>
          <p>{product.description}</p>
        </div>

        <div className="operator-product-details">
          <div className="operator-product-price">
            <strong>{formatCurrency(product.basePrice)}</strong>
            <span>
              {product.hasSizes ? "Com variação de tamanho" : "Preço base"}
            </span>
          </div>

          <span className="operator-product-stock">
            Estoque {product.stock}
          </span>
        </div>

        <button
          className="operator-primary-button"
          type="button"
          disabled={isUnavailable}
          onClick={handleSelectProduct}
        >
          Selecionar produto
        </button>
      </div>
    </article>
  );
}
