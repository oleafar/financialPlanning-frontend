import { useSyncExternalStore } from "react";
import { getToken } from "../services/session";

const listeners = new Set<() => void>();

export function notifySessionChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return getToken();
}

export function useAuthSession() {
  const token = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    token,
    isAuthenticated: Boolean(token),
  };
}
