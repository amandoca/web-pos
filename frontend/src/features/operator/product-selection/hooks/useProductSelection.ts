import { useMemo, useState } from "react";

import {
  type AddCartItemPayload,
  calculateCartItemTotal,
} from "../../../../domain/cart/cart.rules";
import {
  calculateUnitPrice,
  ensureProductIsAvailable,
  ensureRequiredSize,
  ensureStockAvailable,
  ensureUniqueAddons,
  getSelectedSize,
} from "../../../../domain/product/product.rules";
import type {
  Addon,
  Product,
  ProductSizeName,
} from "../../../../domain/product/product.types";
import { useAllowedAddonsQuery } from "../queries/useAllowedAddonsQuery";
import { useProductSizesQuery } from "../queries/useProductSizesQuery";

interface UseProductSelectionParams {
  product: Product | null;
}

interface ProductSelectionState {
  productId: number | null;
  selectedSizeName: ProductSizeName | null;
  selectedAddons: Addon[];
  quantity: number;
}

// Cria o estado inicial usado sempre que o modal abre ou troca de produto.
function createInitialSelectionState(
  productId: number | null,
): ProductSelectionState {
  return {
    productId,
    selectedSizeName: null,
    selectedAddons: [],
    quantity: 1,
  };
}

// Controla toda a configuração do produto antes de ir para o carrinho.
export function useProductSelection({ product }: UseProductSelectionParams) {
  const productId = product?.id ?? null;
  const [selectionState, setSelectionState] = useState<ProductSelectionState>(
    function getInitialSelectionState() {
      return createInitialSelectionState(productId);
    },
  );

  // Isso evita reaproveitar tamanho e adicionais de um produto anterior.
  const isSameProduct = selectionState.productId === productId;
  const selectedSizeName = isSameProduct
    ? selectionState.selectedSizeName
    : null;
  const selectedAddons = useMemo(
    function getSelectedAddons() {
      if (!isSameProduct) {
        return [];
      }

      return selectionState.selectedAddons;
    },
    [isSameProduct, selectionState.selectedAddons],
  );
  const quantity = isSameProduct ? selectionState.quantity : 1;
  const queryProductId = product?.id ?? 0;
  const isEnabled = Boolean(product);

  // Busca os adicionais liberados para o produto aberto no modal.
  const { data: allowedAddons = [], isLoading: isLoadingAddons } =
    useAllowedAddonsQuery(queryProductId, isEnabled);

  // Busca os tamanhos disponíveis para o produto aberto no modal.
  const { data: productSizes = [], isLoading: isLoadingSizes } =
    useProductSizesQuery(queryProductId, isEnabled);

  // Descobre qual tamanho está realmente selecionado.
  const selectedSize = useMemo(
    function getSelectedSizeMemoized() {
      return getSelectedSize(productSizes, selectedSizeName);
    },
    [productSizes, selectedSizeName],
  );

  // Recalcula o preço unitário quando produto, tamanho ou adicionais mudam.
  const unitPrice = useMemo(
    function getUnitPrice() {
      if (!product) {
        return 0;
      }

      return calculateUnitPrice(product, selectedSize, selectedAddons);
    },
    [product, selectedAddons, selectedSize],
  );

  // Multiplica o preço unitário pela quantidade escolhida.
  const totalPrice = useMemo(
    function getTotalPrice() {
      return calculateCartItemTotal(unitPrice, quantity);
    },
    [quantity, unitPrice],
  );

  // Marca o tamanho escolhido pelo usuário.
  function selectSize(sizeName: ProductSizeName) {
    const isValid = productSizes.some((size) => size.name === sizeName);

    if (!isValid) {
      return;
    }

    setSelectionState(function setSize(currentState) {
      // Se o produto mudou, reiniciamos a seleção antes de aplicar o novo tamanho.
      const nextState =
        currentState.productId === productId
          ? currentState
          : createInitialSelectionState(productId);

      return {
        ...nextState,
        selectedSizeName: sizeName,
      };
    });
  }

  // Adiciona ou remove um adicional da seleção atual.
  function toggleAddon(addon: Addon) {
    const exists = selectedAddons.some((item) => item.id === addon.id);

    if (exists) {
      setSelectionState(function removeAddon(currentState) {
        // Se o modal trocou de produto, começamos de um estado limpo.
        const nextState =
          currentState.productId === productId
            ? currentState
            : createInitialSelectionState(productId);

        return {
          ...nextState,
          selectedAddons: nextState.selectedAddons.filter(
            (item) => item.id !== addon.id,
          ),
        };
      });
      return;
    }

    setSelectionState(function addAddon(currentState) {
      // Garante que o adicional seja salvo no produto certo.
      const nextState =
        currentState.productId === productId
          ? currentState
          : createInitialSelectionState(productId);

      return {
        ...nextState,
        selectedAddons: [...nextState.selectedAddons, addon],
      };
    });
  }

  // Aumenta a quantidade escolhida no modal.
  function increaseQuantity() {
    setSelectionState(function increase(currentState) {
      const nextState =
        currentState.productId === productId
          ? currentState
          : createInitialSelectionState(productId);

      return {
        ...nextState,
        quantity: nextState.quantity + 1,
      };
    });
  }

  // Diminui a quantidade sem deixar passar de 1.
  function decreaseQuantity() {
    setSelectionState(function decrease(currentState) {
      const nextState =
        currentState.productId === productId
          ? currentState
          : createInitialSelectionState(productId);

      if (nextState.quantity <= 1) {
        return nextState;
      }

      return {
        ...nextState,
        quantity: nextState.quantity - 1,
      };
    });
  }

  // Limpa a configuração atual ao fechar o modal.
  function resetSelection() {
    setSelectionState(createInitialSelectionState(productId));
  }

  // Valida a escolha e monta o item final que vai para o carrinho.
  function buildCartItemPayload(): AddCartItemPayload {
    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    // Essas regras bloqueiam envio inválido antes de adicionar ao carrinho.
    ensureProductIsAvailable(product);
    ensureRequiredSize(product, selectedSizeName);
    ensureStockAvailable(product, quantity);
    ensureUniqueAddons(selectedAddons);

    return {
      productId: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      stock: product.stock,
      quantity,
      sizeName: selectedSizeName,
      addons: selectedAddons,
      unitPrice,
      totalPrice,
    };
  }

  return {
    allowedAddons,
    productSizes,
    selectedSizeName,
    selectSize,
    selectedAddons,
    quantity,
    unitPrice,
    totalPrice,
    isLoading: isLoadingAddons || isLoadingSizes,
    toggleAddon,
    increaseQuantity,
    decreaseQuantity,
    resetSelection,
    buildCartItemPayload,
  };
}
