export type WebEvent =
  | "auth:changed"
  | "gym:changed"
  | "slots:changed"
  | "attendance:changed"
  | "billing:changed"
  | "analytics:changed";

type Listener = () => void;
const listeners = new Map<WebEvent, Set<Listener>>();

export function emit(event: WebEvent) {
  listeners.get(event)?.forEach((listener) => listener());
}

export function subscribe(event: WebEvent, listener: Listener) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)?.add(listener);
  return () => {
    listeners.get(event)?.delete(listener);
  };
}
