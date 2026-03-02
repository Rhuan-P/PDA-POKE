export interface IEventBus<T = Record<string, unknown>> {
  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void;
  off<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void;
  emit<K extends keyof T>(event: K, payload: T[K]): void;
}
