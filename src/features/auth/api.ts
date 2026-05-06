import { apiClient } from "../../services/api-client";
import { ApiEnvelope, AuthPayload, LoginInput, RegisterInput } from "../../services/types";

export async function login(input: LoginInput) {
  const response = await apiClient.post<ApiEnvelope<AuthPayload>>("/auth/login", input);
  return response.data.data;
}

export async function register(input: RegisterInput) {
  const response = await apiClient.post<ApiEnvelope<AuthPayload>>("/auth/register", input);
  return response.data.data;
}
