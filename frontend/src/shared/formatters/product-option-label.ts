import type {
  Addon,
  ProductSizeName,
} from "../../domain/product/product.types";

// Traduz o nome técnico do tamanho para o texto mostrado na tela.
export function getProductSizeLabel(sizeName: ProductSizeName) {
  switch (sizeName) {
    case "small":
      return "Pequeno";
    case "medium":
      return "Médio";
    case "large":
      return "Grande";
    default:
      return sizeName;
  }
}

// Traduz o nome técnico do adicional para um texto amigável.
export function getAddonLabel(addonName: Addon["name"]) {
  switch (addonName) {
    case "extra_cheese":
      return "Queijo extra";
    case "extra_sauce":
      return "Molho extra";
    case "onion":
      return "Cebola";
    case "bacon":
      return "Bacon";
    case "whipped_cream":
      return "Chantilly";
    default:
      return formatFallbackLabel(addonName);
  }
}

// Gera um rótulo legível quando o adicional não tem tradução fixa.
function formatFallbackLabel(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
