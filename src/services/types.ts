export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthPayload = {
  user: AuthUser;
  token: string;
};

export type TransactionType = "income" | "expense";
export type WalletType = "bank" | "cash" | "digital" | "other";

export type Wallet = {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  walletId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  wallet?: Wallet;
};

export type TransactionsResponse = {
  items: Transaction[];
  page: number;
  pageSize: number;
};

export type SummaryReport = {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
  wallets: Array<Pick<Wallet, "id" | "name" | "type" | "balance">>;
};

export type CategoryReportItem = {
  categoryId: string;
  categoryName: string;
  type: TransactionType;
  total: number;
};

export type PeriodReportItem = {
  period: string;
  income: number;
  expense: number;
  net: number;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type WalletInput = {
  name: string;
  type: WalletType;
  balance?: number;
};

export type CategoryInput = {
  name: string;
  type: TransactionType;
};

export type TransactionInput = {
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  walletId: string;
};

export type TransactionFilters = {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  categoryId?: string;
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type ReportFilters = {
  startDate?: string;
  endDate?: string;
  period?: "day" | "month";
};
