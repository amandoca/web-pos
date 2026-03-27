import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "./store";
import type { RootState } from "./root-reducer";

// Entrega o dispatch já tipado para usar com Redux Toolkit.
export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}

// Lê dados do Redux com tipagem segura.
export function useAppSelector<TSelected>(
  selector: (state: RootState) => TSelected,
): TSelected {
  return useSelector(selector);
}
