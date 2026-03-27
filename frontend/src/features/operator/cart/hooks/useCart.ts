import {
  addCartItem,
  clearCart,
  decreaseOrRemoveCartItem,
  increaseCartItemQuantity,
  removeCartItem,
} from "../../../../application/store/cart/cart.slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../application/store/hooks";
import type { AddCartItemPayload } from "../../../../domain/cart/cart.rules";
import type { RootState } from "../../../../application/store/root-reducer";

// Expõe as ações do carrinho ligadas ao Redux.
export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state: RootState) => state.cart.items);

  // Envia um novo item para o reducer do carrinho.
  function addItem(payload: AddCartItemPayload) {
    dispatch(addCartItem(payload));
  }

  // Remove um item pelo identificador.
  function removeItem(cartItemId: string) {
    dispatch(removeCartItem(cartItemId));
  }

  // Aumenta a quantidade de um item já existente.
  function increaseItemQuantity(cartItemId: string) {
    dispatch(increaseCartItemQuantity(cartItemId));
  }

  // Diminui a quantidade ou remove quando chega ao mínimo.
  function decreaseOrRemoveItem(cartItemId: string) {
    dispatch(decreaseOrRemoveCartItem(cartItemId));
  }

  // Limpa todo o carrinho no Redux.
  function resetCart() {
    dispatch(clearCart());
  }

  return {
    items,
    addItem,
    removeItem,
    increaseItemQuantity,
    decreaseOrRemoveItem,
    resetCart,
  };
}
