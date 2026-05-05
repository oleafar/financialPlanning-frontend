import { useState } from 'react';
import type { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/transactions';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const filtered =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.type === filter);

  function getCategoryName(id: string) {
    return categoryMap.get(id)?.name ?? id;
  }

  function getCategoryColor(id: string) {
    return categoryMap.get(id)?.color ?? '#6b7280';
  }

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === f
                ? f === 'income'
                  ? 'bg-emerald-100 text-emerald-700'
                  : f === 'expense'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'income' ? 'Entradas' : 'Saídas'}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">Nenhuma transação encontrada</p>
          <p className="text-xs mt-1">Adicione uma transação para começar</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group"
            >
              {/* Color indicator */}
              <div
                className="w-1 self-stretch rounded-full shrink-0"
                style={{ backgroundColor: getCategoryColor(t.category) }}
              />

              {/* Icon */}
              <div
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  t.type === 'income' ? 'bg-emerald-50' : 'bg-orange-50'
                }`}
              >
                {t.type === 'income' ? '↑' : '↓'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {t.description || getCategoryName(t.category)}
                  </span>
                  <span
                    className="shrink-0 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: getCategoryColor(t.category) + '22',
                      color: getCategoryColor(t.category),
                    }}
                  >
                    {getCategoryName(t.category)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(t.date)}</p>
              </div>

              {/* Amount */}
              <div
                className={`shrink-0 font-bold text-base ${
                  t.type === 'income' ? 'text-emerald-600' : 'text-orange-600'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </div>

              {/* Actions */}
              <div className="shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => { setConfirmDelete(null); onEdit(t); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className={`p-1.5 rounded-lg transition ${
                    confirmDelete === t.id
                      ? 'text-white bg-red-500'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                  title={confirmDelete === t.id ? 'Confirmar exclusão' : 'Excluir'}
                >
                  {confirmDelete === t.id ? '✓' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
