import type { IEventBus } from '../interfaces/IEventBus';

type Handler = (...args: any[]) => void;

export class EventBus implements IEventBus {
  private handlers: Record<string, Set<Handler>> = {};

  on(event: string, handler: Handler): void {
    if (!this.handlers[event]) this.handlers[event] = new Set();
    this.handlers[event].add(handler);
  }

  off(event: string, handler: Handler): void {
    this.handlers[event]?.delete(handler);
  }

  emit(event: string, payload?: any): void {
    this.handlers[event]?.forEach((handler) => handler(payload));
  }
}
