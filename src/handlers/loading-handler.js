export function withLoading(action) {
  return async (...args) => action(...args);
}
