export const getStorageKey = async <T>(key: string): Promise<T | null> =>
  new Promise((resolve) => {
    let value: T | null = null;

    chrome.storage.local.get(key, (keyObject) => {
      value = keyObject?.[key] != null ? keyObject[key] as T : null;
      resolve(value)
    });
  });
