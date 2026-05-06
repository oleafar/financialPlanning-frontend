import { useMutation } from "@tanstack/react-query";
import { login, register } from "./api";
import { setToken } from "../../services/session";
import { notifySessionChange } from "../../hooks/useAuthSession";

function onAuthSuccess(token: string) {
  setToken(token);
  notifySessionChange();
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
    onSuccess: (payload) => {
      onAuthSuccess(payload.token);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: register,
    onSuccess: (payload) => {
      onAuthSuccess(payload.token);
    },
  });
}
