import type {
  Addon,
  Product,
  ProductSize,
  ProductSizeName,
} from "./product.types";

// Impede venda de produto indisponível ou sem estoque.
export function ensureProductIsAvailable(product: Product): void {
  if (!product.isAvailable) {
    throw new Error("Produto indisponível.");
  }

  if (product.stock <= 0) {
    throw new Error("Produto sem estoque.");
  }
}

// Exige tamanho quando o produto trabalha com essa opção.
export function ensureRequiredSize(
  product: Product,
  selectedSizeName: ProductSizeName | null,
): void {
  if (product.hasSizes && !selectedSizeName) {
    throw new Error("Selecione um tamanho.");
  }
}

// Confere se a quantidade pedida cabe no estoque.
export function ensureStockAvailable(product: Product, quantity: number): void {
  if (quantity < 1) {
    throw new Error("Quantidade inválida.");
  }

  if (quantity > product.stock) {
    throw new Error("Quantidade maior que o estoque disponível.");
  }
}

// Garante que o mesmo adicional não seja escolhido duas vezes.
export function ensureUniqueAddons(addons: Addon[]): void {
  const addonIds = addons.map((addon) => addon.id);

  if (new Set(addonIds).size !== addonIds.length) {
    throw new Error("Não é permitido repetir adicionais.");
  }
}

// Encontra o tamanho selecionado dentro da lista disponível.
export function getSelectedSize(
  sizes: ProductSize[],
  selectedSizeName: ProductSizeName | null,
): ProductSize | null {
  if (!selectedSizeName) {
    return null;
  }

  return sizes.find((size) => size.name === selectedSizeName) ?? null;
}

// Calcula o preço do produto já considerando tamanho e adicionais.
export function calculateUnitPrice(
  product: Product,
  size: ProductSize | null,
  addons: Addon[],
): number {
  const sizeExtraPrice = size?.extraPrice ?? 0;
  const addonsTotal = addons.reduce((total, addon) => total + addon.price, 0);

  return Number((product.basePrice + sizeExtraPrice + addonsTotal).toFixed(2));
}

// Diz se o valor informado para estoque pode ser salvo.
export function isValidStock(value: number): boolean {
  return !Number.isNaN(value) && value >= 0;
}

// Limpa o valor digitado no estoque e usa um valor seguro quando necessário.
export function sanitizeStockInput(rawValue: string, fallback: number): number {
  const parsed = Number(rawValue);

  if (Number.isNaN(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

// Calcula o próximo valor do estoque ao clicar em mais ou menos.
export function calculateNextStock(
  currentRawValue: string,
  direction: "increase" | "decrease",
): string {
  const currentStock = Number(currentRawValue);

  if (Number.isNaN(currentStock) || currentStock < 0) {
    return "0";
  }

  if (direction === "decrease") {
    return currentStock <= 0 ? "0" : String(currentStock - 1);
  }

  return String(currentStock + 1);
}

// Bloqueia qualquer tentativa de salvar estoque negativo.
export function ensureStockIsNotNegative(stock: number): void {
  if (stock < 0) {
    throw new Error("Estoque não pode ser negativo.");
  }
}

// Atualiza o estoque de um produto específico na lista.
export function applyStockUpdate(
  products: Product[],
  productId: number,
  stock: number,
): Product[] {
  return products.map((product) => {
    if (product.id !== productId) {
      return product;
    }

    return {
      ...product,
      stock,
      isAvailable: stock > 0,
    };
  });
}

// Atualiza a disponibilidade respeitando a regra de estoque zero.
export function applyAvailabilityUpdate(
  products: Product[],
  productId: number,
  isAvailable: boolean,
): Product[] {
  return products.map((product) => {
    if (product.id !== productId) {
      return product;
    }

    if (product.stock === 0) {
      return {
        ...product,
        isAvailable: false,
      };
    }

    return {
      ...product,
      isAvailable,
    };
  });
}
