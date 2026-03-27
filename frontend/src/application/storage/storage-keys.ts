export type StorageResource =
  | "session"
  | "products"
  | "categories"
  | "payment-methods"
  | "orders"
  | "addons"
  | "product-sizes";

export type UserStorageResource = "cart";

const STORAGE_PREFIX = "web-pos";

// Monta a chave padrão para recursos globais do sistema.
export function getStorageKey(resource: StorageResource): string {
  return `${STORAGE_PREFIX}:${resource}`;
}

// Monta a chave de recursos que pertencem a um usuário específico.
export function getUserStorageKey(
  userId: number,
  resource: UserStorageResource,
): string {
  return `${STORAGE_PREFIX}:user:${userId}:${resource}`;
}
