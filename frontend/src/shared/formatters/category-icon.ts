import type { CategoryFilter } from "./category-label";

const DEFAULT_CATEGORY_ICON = "/images/category-icons/lunch.png";

const CATEGORY_ICON_MAP: Record<string, string> = {
  all: "/images/category-icons/lunch.png",
  meats: "/images/category-icons/butcher.png",
  hamburgers: "/images/category-icons/burguer.png",
  pizzas: "/images/category-icons/pizza.png",
  drinks: "/images/category-icons/cocktail.png",
  desserts: "/images/category-icons/dessert.png",
  snacks: "/images/category-icons/chips.png",
  pasta: "/images/category-icons/spagetti.png",
  salads: "/images/category-icons/salad.png",
};

// Devolve o ícone usado para cada categoria da interface.
export function getCategoryIconSrc(category: CategoryFilter): string {
  return CATEGORY_ICON_MAP[category] ?? DEFAULT_CATEGORY_ICON;
}
