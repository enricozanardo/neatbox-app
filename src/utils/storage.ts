import { isDev, sanitizeBuffers } from './helpers';

export type StorageKey = 'neatbox-wallet-map' | 'templates';

export const setToLocalStorage = (data: string | Object | boolean, keyInput: StorageKey) => {
  let key = keyInput;

  if (isDev) {
    key += '_dev';
  }

  const processed = typeof data === 'string' ? data : JSON.stringify(data);
  localStorage.setItem(key, processed);
};

export const getFromLocalStorage = <T>(keyInput: StorageKey): T | null => {
  let key = keyInput;

  if (isDev) {
    key += '_dev';
  }

  console.log(keyInput);
  const data = localStorage.getItem(key);

  let parsed;
  try {
    parsed = data ? JSON.parse(data) : null;
  } catch (err) {
    parsed = data;
  }

  return sanitizeBuffers(parsed);
};

export const removeItemFromStorage = (key: StorageKey) => {
  localStorage.removeItem(key);
};
