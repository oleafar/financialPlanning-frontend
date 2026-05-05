import type { Transaction, MonthSummary } from '../types';

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatMonthYear(monthString: string): string {
  const [year, month] = monthString.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMonthString(dateString: string): string {
  return dateString.slice(0, 7); // YYYY-MM
}

export function calculateTotals(transactions: Transaction[]): {
  income: number;
  expense: number;
  balance: number;
} {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expense, balance: income - expense };
}

export function groupByMonth(transactions: Transaction[]): MonthSummary[] {
  const monthMap = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    const month = getMonthString(t.date);
    const current = monthMap.get(month) ?? { income: 0, expense: 0 };
    if (t.type === 'income') {
      monthMap.set(month, { ...current, income: current.income + t.amount });
    } else {
      monthMap.set(month, { ...current, expense: current.expense + t.amount });
    }
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { income, expense }]) => ({
      month,
      income,
      expense,
      balance: income - expense,
    }));
}

export function filterTransactionsByMonth(
  transactions: Transaction[],
  month: string
): Transaction[] {
  return transactions.filter((t) => getMonthString(t.date) === month);
}
