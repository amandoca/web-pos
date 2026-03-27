// Lê um valor do localStorage e devolve um fallback se algo der errado.
export function getStorageItem<T>(key: string, fallbackValue: T): T {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallbackValue;
  }
}

// Salva um valor serializado no localStorage.
export function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Remove uma chave do localStorage.
export function removeStorageItem(key: string): void {
  localStorage.removeItem(key);
}
