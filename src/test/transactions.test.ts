import { describe, it, expect } from 'vitest';
import {
  calculateTotals,
  groupByMonth,
  filterTransactionsByMonth,
  formatCurrency,
  formatDate,
  getMonthString,
} from '../utils/transactions';
import type { Transaction } from '../types';

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    category: 'salary',
    description: 'Salário',
    date: '2025-01-10',
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    type: 'expense',
    amount: 1200,
    category: 'housing',
    description: 'Aluguel',
    date: '2025-01-05',
    createdAt: '2025-01-05T08:00:00Z',
  },
  {
    id: '3',
    type: 'expense',
    amount: 300,
    category: 'food',
    description: 'Supermercado',
    date: '2025-01-20',
    createdAt: '2025-01-20T14:00:00Z',
  },
  {
    id: '4',
    type: 'income',
    amount: 1500,
    category: 'freelance',
    description: 'Projeto freelance',
    date: '2025-02-15',
    createdAt: '2025-02-15T09:00:00Z',
  },
  {
    id: '5',
    type: 'expense',
    amount: 400,
    category: 'transport',
    description: 'Combustível',
    date: '2025-02-10',
    createdAt: '2025-02-10T11:00:00Z',
  },
];

describe('calculateTotals', () => {
  it('calculates income, expense, and balance correctly', () => {
    const result = calculateTotals(sampleTransactions);
    expect(result.income).toBe(6500); // 5000 + 1500
    expect(result.expense).toBe(1900); // 1200 + 300 + 400
    expect(result.balance).toBe(4600); // 6500 - 1900
  });

  it('returns zeros for empty list', () => {
    const result = calculateTotals([]);
    expect(result.income).toBe(0);
    expect(result.expense).toBe(0);
    expect(result.balance).toBe(0);
  });

  it('returns negative balance when expenses exceed income', () => {
    const transactions: Transaction[] = [
      {
        id: 'a',
        type: 'income',
        amount: 100,
        category: 'salary',
        description: '',
        date: '2025-01-01',
        createdAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'b',
        type: 'expense',
        amount: 200,
        category: 'food',
        description: '',
        date: '2025-01-02',
        createdAt: '2025-01-02T00:00:00Z',
      },
    ];
    const result = calculateTotals(transactions);
    expect(result.balance).toBe(-100);
  });
});

describe('filterTransactionsByMonth', () => {
  it('filters transactions for a given month', () => {
    const result = filterTransactionsByMonth(sampleTransactions, '2025-01');
    expect(result).toHaveLength(3);
    expect(result.every((t) => t.date.startsWith('2025-01'))).toBe(true);
  });

  it('returns empty array for a month with no transactions', () => {
    const result = filterTransactionsByMonth(sampleTransactions, '2025-03');
    expect(result).toHaveLength(0);
  });
});

describe('groupByMonth', () => {
  it('groups transactions by month and sorts them', () => {
    const result = groupByMonth(sampleTransactions);
    expect(result).toHaveLength(2);
    expect(result[0].month).toBe('2025-01');
    expect(result[1].month).toBe('2025-02');
  });

  it('calculates correct totals per month', () => {
    const result = groupByMonth(sampleTransactions);
    const jan = result.find((r) => r.month === '2025-01')!;
    expect(jan.income).toBe(5000);
    expect(jan.expense).toBe(1500); // 1200 + 300
    expect(jan.balance).toBe(3500);

    const feb = result.find((r) => r.month === '2025-02')!;
    expect(feb.income).toBe(1500);
    expect(feb.expense).toBe(400);
    expect(feb.balance).toBe(1100);
  });

  it('returns empty array for no transactions', () => {
    expect(groupByMonth([])).toHaveLength(0);
  });
});

describe('formatCurrency', () => {
  it('formats a positive number as BRL', () => {
    const result = formatCurrency(1500);
    expect(result).toContain('1.500');
    expect(result).toContain('R$');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });
});

describe('formatDate', () => {
  it('formats a date string to Brazilian format', () => {
    const result = formatDate('2025-01-05');
    expect(result).toContain('05');
    expect(result).toContain('01');
    expect(result).toContain('2025');
  });
});

describe('getMonthString', () => {
  it('extracts YYYY-MM from a date string', () => {
    expect(getMonthString('2025-03-15')).toBe('2025-03');
    expect(getMonthString('2025-12-01')).toBe('2025-12');
  });
});
