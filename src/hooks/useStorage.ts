import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '../types';
import { DEFAULT_CATEGORIES } from '../utils/categories';
import type { Category } from '../types';

const TRANSACTIONS_KEY = 'fp_transactions';
const CATEGORIES_KEY = 'fp_categories';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore storage errors
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage<Transaction[]>(TRANSACTIONS_KEY, [])
  );

  useEffect(() => {
    saveToStorage(TRANSACTIONS_KEY, transactions);
  }, [transactions]);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  }, []);

  const updateTransaction = useCallback((updated: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { transactions, addTransaction, updateTransaction, deleteTransaction };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage<Category[]>(CATEGORIES_KEY, DEFAULT_CATEGORIES)
  );

  useEffect(() => {
    saveToStorage(CATEGORIES_KEY, categories);
  }, [categories]);

  const addCategory = useCallback((category: Category) => {
    setCategories((prev) => [...prev, category]);
  }, []);

  return { categories, addCategory };
}
