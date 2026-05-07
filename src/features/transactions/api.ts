import { apiClient } from "../../services/api-client";
import { normalizeTransactionsResponse } from "../../services/normalizers";
import {
  ApiEnvelope,
  Transaction,
  TransactionFilters,
  TransactionInput,
  TransactionsResponse,
} from "../../services/types";

export async function listTransactions(filters: TransactionFilters) {
  const response = await apiClient.get<ApiEnvelope<TransactionsResponse>>("/transactions", {
    params: filters,
  });
  return normalizeTransactionsResponse(response.data.data);
}

export async function createTransaction(input: TransactionInput) {
  const response = await apiClient.post<ApiEnvelope<Transaction>>("/transactions", input);
  return response.data.data;
}

export async function updateTransaction(id: string, input: Partial<TransactionInput>) {
  const response = await apiClient.patch<ApiEnvelope<Transaction>>(`/transactions/${id}`, input);
  return response.data.data;
}

export async function deleteTransaction(id: string) {
  await apiClient.delete(`/transactions/${id}`);
}
