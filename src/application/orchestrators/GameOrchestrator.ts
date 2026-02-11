import { EventBus } from '../events/EventBus';

export class GameOrchestrator {
  constructor(private eventBus: EventBus) {}

  // TODO: conectar use-cases, services e state
  initialize(): void {
    this.eventBus.emit('app:init');
  }
}
