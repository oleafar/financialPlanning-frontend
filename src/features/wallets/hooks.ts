import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWallet, deleteWallet, listWallets, updateWallet } from "./api";
import { queryKeys } from "../../services/query-keys";

export function useWalletsQuery() {
  return useQuery({
    queryKey: queryKeys.wallets,
    queryFn: listWallets,
  });
}

export function useCreateWalletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWallet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useUpdateWalletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof updateWallet>[1] }) =>
      updateWallet(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useDeleteWalletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWallet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
