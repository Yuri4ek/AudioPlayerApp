import Storage from 'expo-sqlite/kv-store';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const v = Storage.getItemSync(key);
      return v == null ? fallback : (JSON.parse(v) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      Storage.setItemSync(key, JSON.stringify(value));
    } catch {}
  },
};
