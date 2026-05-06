import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from "./api";
import { queryKeys } from "../../services/query-keys";
import { TransactionFilters } from "../../services/types";
import { toQueryKeyPart } from "../../utils/query";

export function useTransactionsQuery(filters: TransactionFilters) {
  const keyPart = toQueryKeyPart(filters);
  return useQuery({
    queryKey: queryKeys.transactions(keyPart),
    queryFn: () => listTransactions(filters),
  });
}

async function invalidateTransactionViews(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.invalidateQueries({ queryKey: ["transactions"] });
  await queryClient.invalidateQueries({ queryKey: ["reports"] });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: async () => {
      await invalidateTransactionViews(queryClient);
    },
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Parameters<typeof createTransaction>[0]> }) =>
      updateTransaction(id, input),
    onSuccess: async () => {
      await invalidateTransactionViews(queryClient);
    },
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await invalidateTransactionViews(queryClient);
    },
  });
}
