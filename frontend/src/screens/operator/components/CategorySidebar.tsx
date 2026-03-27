import type { MouseEvent } from "react";

import type { Category } from "../../../domain/product/product.types";
import { getCategoryIconSrc } from "../../../shared/formatters/category-icon";
import { getCategoryLabel } from "../../../shared/formatters/category-label";
import { LoadingState } from "../../../shared/ui/LoadingState";

interface CategorySidebarProps {
  categories: Category[];
  isLoading: boolean;
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

// Mostra as categorias que filtram o catálogo do operador.
export function CategorySidebar({
  categories,
  isLoading,
  selectedCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  // Traduz o clique do botão para a categoria correspondente.
  function handleSelectCategory(event: MouseEvent<HTMLButtonElement>) {
    const categoryId = event.currentTarget.value;

    if (categoryId === "all") {
      onSelectCategory(null);
      return;
    }

    const nextCategory = categories.find(function matchCategory(category) {
      return String(category.id) === categoryId;
    });

    // Se a categoria não existir mais, ignoramos a ação.
    if (!nextCategory) {
      return;
    }

    onSelectCategory(nextCategory);
  }

  if (isLoading) {
    return (
      <aside className="operator-category-sidebar">
        <LoadingState message="Carregando categorias..." />
      </aside>
    );
  }

  return (
    <aside className="operator-category-sidebar">
      <p className="operator-category-caption">Categorias</p>

      <button
        className={buildButtonClassName(selectedCategory === null)}
        type="button"
        value="all"
        aria-label={getCategoryLabel("all")}
        title={getCategoryLabel("all")}
        aria-pressed={selectedCategory === null}
        onClick={handleSelectCategory}
      >
        <img src={getCategoryIconSrc("all")} alt="" />
        <span className="operator-category-label">
          {getCategoryLabel("all")}
        </span>
      </button>

      {categories.map((category) => {
        const isSelected = selectedCategory?.id === category.id;

        return (
          <button
            key={category.id}
            className={buildButtonClassName(isSelected)}
            type="button"
            value={String(category.id)}
            aria-label={getCategoryLabel(category.name)}
            title={getCategoryLabel(category.name)}
            aria-pressed={isSelected}
            onClick={handleSelectCategory}
          >
            <img src={getCategoryIconSrc(category.name)} alt="" />
            <span className="operator-category-label">
              {getCategoryLabel(category.name)}
            </span>
          </button>
        );
      })}
    </aside>
  );
}

// Define a aparência do botão selecionado.
function buildButtonClassName(isSelected: boolean) {
  return `operator-category-button${isSelected ? " is-selected" : ""}`;
}
