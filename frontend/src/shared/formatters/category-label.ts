import type { CategoryName } from "../../domain/product/product.types";

export type CategoryFilter = CategoryName | "all";

// Traduz o nome técnico da categoria para um texto amigável.
export function getCategoryLabel(categoryName: CategoryFilter) {
  switch (categoryName) {
    case "all":
      return "Todos";
    case "meats":
      return "Carnes";
    case "hamburgers":
      return "Hambúrgueres";
    case "pizzas":
      return "Pizzas";
    case "drinks":
      return "Bebidas";
    case "desserts":
      return "Sobremesas";
    case "snacks":
      return "Lanches";
    case "pasta":
      return "Massas";
    case "salads":
      return "Saladas";
    default:
      return categoryName;
  }
}
