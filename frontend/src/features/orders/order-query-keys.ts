// Centraliza as chaves usadas pelo TanStack Query nos pedidos.
export const orderQueryKeys = {
  all() {
    return ["orders"] as const;
  },
  list() {
    return ["orders"] as const;
  },
  history(userId: number) {
    return ["orders", "history", userId] as const;
  },
};
