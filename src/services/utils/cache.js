export function createCache(ttlMs = 5 * 60 * 1000) {
  const store = new Map();

  function get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return null;
    }
    return entry.value;
  }

  function set(key, value) {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  function has(key) {
    return get(key) !== null;
  }

  function clear() {
    store.clear();
  }

  return { get, set, has, clear };
}