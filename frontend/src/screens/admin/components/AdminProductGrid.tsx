import type { Product } from "../../../domain/product/product.types";
import { AdminProductCard } from "./AdminProductCard";

interface AdminProductGridProps {
  products: Product[];
  updatingProductId: number | null;
  updatingAvailabilityId: number | null;
  onUpdateStock: (productId: number, stock: number) => Promise<void>;
  onToggleAvailability: (productId: number, value: boolean) => Promise<void>;
}

// Organiza os cards de produtos do admin em grade.
export function AdminProductGrid({
  products,
  updatingProductId,
  updatingAvailabilityId,
  onUpdateStock,
  onToggleAvailability,
}: AdminProductGridProps) {
  return (
    <div className="admin-product-grid">
      {products.map((product) => {
        // Cada card sabe se é ele que está sendo atualizado no momento.
        const isUpdatingStock = updatingProductId === product.id;
        const isUpdatingAvailability = updatingAvailabilityId === product.id;

        return (
          <AdminProductCard
            key={`${product.id}-${product.stock}-${product.isAvailable}`}
            product={product}
            isUpdatingStock={isUpdatingStock}
            isUpdatingAvailability={isUpdatingAvailability}
            onUpdateStock={onUpdateStock}
            onToggleAvailability={onToggleAvailability}
          />
        );
      })}
    </div>
  );
}
