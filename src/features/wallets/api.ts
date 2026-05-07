import { apiClient } from "../../services/api-client";
import { normalizeWallets } from "../../services/normalizers";
import { ApiEnvelope, Wallet, WalletInput } from "../../services/types";

export async function listWallets() {
  const response = await apiClient.get<ApiEnvelope<Wallet[]>>("/wallets");
  return normalizeWallets(response.data.data);
}

export async function createWallet(input: WalletInput) {
  const response = await apiClient.post<ApiEnvelope<Wallet>>("/wallets", input);
  return response.data.data;
}

export async function updateWallet(id: string, input: WalletInput) {
  const response = await apiClient.patch<ApiEnvelope<Wallet>>(`/wallets/${id}`, input);
  return response.data.data;
}

export async function deleteWallet(id: string) {
  await apiClient.delete(`/wallets/${id}`);
}
