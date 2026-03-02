import type { IEventBus } from '../interfaces/IEventBus';

type EventHandler<T = unknown> = (payload: T) => void;

export class EventBus<T = Record<string, unknown>> implements IEventBus<T> {
  private handlers: Record<string, Set<EventHandler>> = {};

  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const eventKey = event as string;
    if (!this.handlers[eventKey]) this.handlers[eventKey] = new Set();
    this.handlers[eventKey].add(handler as EventHandler);
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const eventKey = event as string;
    this.handlers[eventKey]?.delete(handler as EventHandler);
  }

  emit<K extends keyof T>(event: K, payload: T[K]): void {
    const eventKey = event as string;
    this.handlers[eventKey]?.forEach((handler) => handler(payload));
  }
}
