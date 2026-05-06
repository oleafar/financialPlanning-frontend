import axios from "axios";
import { env } from "../config/env";
import { clearToken, getToken } from "./session";
import { toAppError } from "../utils/errors";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearToken();

      if (!["/login", "/register"].includes(window.location.pathname)) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(toAppError(error));
  },
);
