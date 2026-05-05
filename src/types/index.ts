export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string; // ISO datetime string
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface MonthSummary {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  balance: number;
}
