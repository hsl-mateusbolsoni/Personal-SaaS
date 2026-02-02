import type { Invoice } from '../types/invoice';
import type { Client } from '../types/client';

type EventMap = {
  'invoice:created': Invoice;
  'invoice:updated': Invoice;
  'invoice:deleted': string;
  'invoice:paid': Invoice;
  'client:created': Client;
};

type Handler<T> = (data: T) => void;

class EventBus {
  private listeners: Map<string, Set<Handler<unknown>>> = new Map();

  on<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as Handler<unknown>);
  }

  off<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>) {
    this.listeners.get(event)?.delete(handler as Handler<unknown>);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    this.listeners.get(event)?.forEach((handler) => handler(data));
  }
}

export const eventBus = new EventBus();
