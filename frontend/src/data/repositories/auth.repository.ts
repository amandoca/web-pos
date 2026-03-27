import { fakeDelay } from "../../application/async/fake-delay";
import { getStorageKey } from "../../application/storage/storage-keys";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../../application/storage/local-storage";
import type { User } from "../../domain/auth/auth.types";
import { usersMock } from "../mocks/users.mock";

// Remove dados sensíveis antes de salvar o usuário na sessão.
function sanitizeUser(user: (typeof usersMock)[number]): User {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
  };
}

// Confere as credenciais e salva a sessão quando o login funciona.
export async function login(username: string, password: string): Promise<User> {
  await fakeDelay();

  const user = usersMock.find(
    (item) =>
      item.username === username && item.password === password && item.isActive,
  );

  if (!user) {
    throw new Error("Usuário ou senha inválidos.");
  }

  const sessionUser = sanitizeUser(user);

  setStorageItem(getStorageKey("session"), sessionUser);

  return sessionUser;
}

// Encerra a sessão salva no navegador.
export async function logout(): Promise<void> {
  await fakeDelay();
  removeStorageItem(getStorageKey("session"));
}

// Lê a sessão atual salva no navegador.
export async function getSession(): Promise<User | null> {
  await fakeDelay();
  return getStorageItem<User | null>(getStorageKey("session"), null);
}
