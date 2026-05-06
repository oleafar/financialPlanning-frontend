export const queryKeys = {
  auth: ["auth"] as const,
  wallets: ["wallets"] as const,
  categories: ["categories"] as const,
  transactions: (params?: string) => ["transactions", params] as const,
  summaryReport: (params?: string) => ["reports", "summary", params] as const,
  categoryReport: (params?: string) => ["reports", "by-category", params] as const,
};
