import { useSyncExternalStore } from "react";
import { getToken, isAuthenticated } from "../services/session";

const listeners = new Set<() => void>();

export function notifySessionChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return {
    token: getToken(),
    isAuthenticated: isAuthenticated(),
  };
}

export function useAuthSession() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
