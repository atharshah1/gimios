export type MobileEvent =
  | "roster:changed"
  | "slots:changed"
  | "attendance:changed"
  | "gym:changed"
  | "session:changed";

type Listener = () => void;
const listeners = new Map<MobileEvent, Set<Listener>>();

export function emit(event: MobileEvent) {
  listeners.get(event)?.forEach((listener) => listener());
}

export function subscribe(event: MobileEvent, listener: Listener) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)?.add(listener);
  return () => {
    listeners.get(event)?.delete(listener);
  };
}
