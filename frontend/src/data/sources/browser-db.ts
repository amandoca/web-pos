import { fakeDelay } from "../../application/async/fake-delay";
import {
  getStorageItem,
  setStorageItem,
} from "../../application/storage/local-storage";

// Simula a leitura assíncrona de uma coleção no navegador.
export async function readCollection<T>(
  key: string,
  fallbackValue: T,
): Promise<T> {
  await fakeDelay();
  return getStorageItem<T>(key, fallbackValue);
}

// Simula a gravação assíncrona de uma coleção no navegador.
export async function writeCollection<T>(key: string, value: T): Promise<T> {
  await fakeDelay();
  setStorageItem<T>(key, value);
  return value;
}
