import type { Product } from "../../domain/product/product.types";
import {
  getAllowedAddonsByProductId,
  getCategories,
  getPaymentMethods,
  getProducts,
  getSizesByProductId,
  getAddons,
  saveProducts,
} from "../../data/repositories/products.repository";

// Busca a lista de adicionais disponíveis.
export function getAddonsAction() {
  return getAddons();
}

// Busca os produtos do catálogo.
export function getProductsAction() {
  return getProducts();
}

// Busca as categorias fixas usadas no catálogo.
export function getCategoriesAction() {
  return getCategories();
}

// Busca as formas de pagamento disponíveis.
export function getPaymentMethodsAction() {
  return getPaymentMethods();
}

// Busca os adicionais liberados para um produto específico.
export function getAllowedAddonsByProductIdAction(productId: number) {
  return getAllowedAddonsByProductId(productId);
}

// Busca os tamanhos cadastrados para um produto específico.
export function getSizesByProductIdAction(productId: number) {
  return getSizesByProductId(productId);
}

// Salva a lista de produtos já atualizada.
export function saveProductsAction(products: Product[]) {
  return saveProducts(products);
}
