import {
  Category,
  CategoryReportItem,
  PeriodReportItem,
  SummaryReport,
  Transaction,
  TransactionsResponse,
  Wallet,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

export function normalizeCollection<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  const record = asRecord(value);

  if (!record) {
    return [];
  }

  if (Array.isArray(record.items)) {
    return record.items as T[];
  }

  if (Array.isArray(record.data)) {
    return record.data as T[];
  }

  return [];
}

export function normalizeTransactionsResponse(value: unknown): TransactionsResponse {
  const record = asRecord(value);

  if (!record) {
    return { items: [], page: 1, pageSize: 10 };
  }

  return {
    items: normalizeCollection<Transaction>(record.items ?? value),
    page: typeof record.page === "number" ? record.page : 1,
    pageSize: typeof record.pageSize === "number" ? record.pageSize : 10,
  };
}

export function normalizeSummaryReport(value: unknown): SummaryReport {
  const record = asRecord(value);

  if (!record) {
    return {
      totalBalance: 0,
      totalIncome: 0,
      totalExpense: 0,
      net: 0,
      wallets: [],
    };
  }

  const totalIncome =
    typeof record.totalIncome === "number"
      ? record.totalIncome
      : typeof record.income === "number"
        ? record.income
        : 0;
  const totalExpense =
    typeof record.totalExpense === "number"
      ? record.totalExpense
      : typeof record.expense === "number"
        ? record.expense
        : 0;

  return {
    totalBalance: typeof record.totalBalance === "number" ? record.totalBalance : 0,
    totalIncome,
    totalExpense,
    net: typeof record.net === "number" ? record.net : totalIncome - totalExpense,
    wallets: normalizeCollection<Wallet>(record.wallets),
  };
}

export function normalizeCategoryReport(value: unknown): CategoryReportItem[] {
  return normalizeCollection<CategoryReportItem>(value);
}

export function normalizePeriodReport(value: unknown): PeriodReportItem[] {
  return normalizeCollection<PeriodReportItem>(value);
}

export function normalizeCategories(value: unknown): Category[] {
  return normalizeCollection<Category>(value);
}

export function normalizeWallets(value: unknown): Wallet[] {
  return normalizeCollection<Wallet>(value);
}
