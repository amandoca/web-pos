import { getStorageKey } from "../../application/storage/storage-keys";
import type {
  Addon,
  Category,
  PaymentMethod,
  Product,
  ProductSize,
} from "../../domain/product/product.types";
import { addonsMock } from "../mocks/addons.mock";
import { categoriesMock } from "../mocks/categories.mock";
import { paymentMethodsMock } from "../mocks/payment-methods.mock";
import { productsMock } from "../mocks/products.mock";
import { productSizesMock } from "../mocks/product-sizes.mock";
import { readCollection, writeCollection } from "../sources/browser-db";

// Lê os produtos salvos na base local.
export async function getProducts(): Promise<Product[]> {
  return readCollection<Product[]>(getStorageKey("products"), productsMock);
}

// Salva a lista atual de produtos.
export async function saveProducts(products: Product[]): Promise<Product[]> {
  return writeCollection<Product[]>(getStorageKey("products"), products);
}

// Procura um produto específico pelo id.
export async function getProductById(
  productId: number,
): Promise<Product | null> {
  const products = await getProducts();

  return products.find((product) => product.id === productId) ?? null;
}

// Lê as categorias disponíveis no catálogo.
export async function getCategories(): Promise<Category[]> {
  return readCollection<Category[]>(
    getStorageKey("categories"),
    categoriesMock,
  );
}

// Lê as formas de pagamento cadastradas.
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return readCollection<PaymentMethod[]>(
    getStorageKey("payment-methods"),
    paymentMethodsMock,
  );
}

// Lê os adicionais disponíveis.
export async function getAddons(): Promise<Addon[]> {
  return readCollection<Addon[]>(getStorageKey("addons"), addonsMock);
}

// Lê todos os tamanhos cadastrados.
export async function getProductSizes(): Promise<ProductSize[]> {
  return readCollection<ProductSize[]>(
    getStorageKey("product-sizes"),
    productSizesMock,
  );
}

// Busca só os adicionais permitidos para o produto escolhido.
export async function getAllowedAddonsByProductId(
  productId: number,
): Promise<Addon[]> {
  const [products, addons] = await Promise.all([getProducts(), getAddons()]);

  const product = products.find((item) => item.id === productId);

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  return addons.filter((addon) => product.addonIds.includes(addon.id));
}

// Busca só os tamanhos ligados ao produto escolhido.
export async function getSizesByProductId(
  productId: number,
): Promise<ProductSize[]> {
  const sizes = await getProductSizes();

  return sizes.filter((size) => size.productId === productId);
}
