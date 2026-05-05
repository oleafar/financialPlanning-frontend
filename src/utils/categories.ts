import type { Category } from '../types';

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salário', type: 'income', color: '#10b981' },
  { id: 'freelance', name: 'Freelance', type: 'income', color: '#34d399' },
  { id: 'investment', name: 'Investimento', type: 'income', color: '#6ee7b7' },
  { id: 'bonus', name: 'Bônus', type: 'income', color: '#a7f3d0' },
  { id: 'other-income', name: 'Outros (Entrada)', type: 'income', color: '#d1fae5' },
];

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'housing', name: 'Moradia', type: 'expense', color: '#f97316' },
  { id: 'food', name: 'Alimentação', type: 'expense', color: '#fb923c' },
  { id: 'transport', name: 'Transporte', type: 'expense', color: '#fdba74' },
  { id: 'health', name: 'Saúde', type: 'expense', color: '#ef4444' },
  { id: 'education', name: 'Educação', type: 'expense', color: '#8b5cf6' },
  { id: 'entertainment', name: 'Lazer', type: 'expense', color: '#ec4899' },
  { id: 'clothing', name: 'Vestuário', type: 'expense', color: '#f59e0b' },
  { id: 'utilities', name: 'Contas', type: 'expense', color: '#06b6d4' },
  { id: 'other-expense', name: 'Outros (Saída)', type: 'expense', color: '#6b7280' },
];

export const DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_INCOME_CATEGORIES,
  ...DEFAULT_EXPENSE_CATEGORIES,
];
