export const getStorageKey = async <T = any>(key: string): Promise<T | null> =>
  new Promise((resolve) => {
    let value: T | null = null;

    chrome.storage.local.get(key, (keyObject) => {
      value = keyObject?.[key] != null ? keyObject[key] as T : null;
      resolve(value)
    });
  });

export const setStorageKey = async (key: string, value: any): Promise<void> => {
  const existingKey = await getStorageKey(key);
  if (existingKey != null) {
    await chrome.storage.local.remove(key);
  }

  await chrome.storage.local.set({ [key]: value })
}
